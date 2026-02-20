const PROD_APP_BASE_URL = "https://wekiban.github.io/task-tracker/";
const LOCAL_APP_BASE_URL = "http://127.0.0.1:5001/";
const USE_LOCAL_STORAGE_KEY = "taskPilotUseLocal";

const jiraIdInput = document.getElementById("jiraId");
const titleInput = document.getElementById("title");
const useLocalInput = document.getElementById("useLocal");
const statusEl = document.getElementById("status");

function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b00020" : "#1a7f37";
}

function parseFromText(text) {
  if (!text) return null;
  const match = text.match(/\b([A-Za-z][A-Za-z0-9]+-\d+)\b/);
  if (!match) return null;

  const rawJiraId = match[1];
  const jiraId = rawJiraId.toUpperCase();
  const title = text
    .replace(rawJiraId, "")
    .replace(/\s*-\s*Jira.*$/i, "")
    .replace(/^\s*\[[^\]]*\]\s*/, "")
    .replace(/^[-:|\s]+/, "")
    .trim();

  return {
    jiraId,
    title: title || text.trim(),
  };
}

function parseFromUrl(urlValue) {
  if (!urlValue) return null;

  try {
    const url = new URL(urlValue);
    const decodedPath = decodeURIComponent(url.pathname || "");
    const pathMatch = decodedPath.match(/\b([A-Za-z][A-Za-z0-9]+-\d+)\b/);
    if (pathMatch) {
      return {
        jiraId: pathMatch[1].toUpperCase(),
        title: "",
      };
    }

    const searchValues = [
      url.searchParams.get("selectedIssue"),
      url.searchParams.get("issueKey"),
      url.searchParams.get("key"),
    ].filter(Boolean);

    for (const value of searchValues) {
      const parsed = parseFromText(String(value));
      if (parsed?.jiraId) {
        return parsed;
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function getAppTabPattern(baseUrl) {
  const appUrl = new URL(baseUrl);
  return `${appUrl.origin}${appUrl.pathname}*`;
}

async function findOpenAppBaseUrl(baseUrl) {
  const existingTabs = await chrome.tabs.query({ url: getAppTabPattern(baseUrl) });
  return existingTabs.length > 0 ? baseUrl : null;
}

function loadUseLocalPreference() {
  return new Promise((resolve) => {
    chrome.storage.local.get([USE_LOCAL_STORAGE_KEY], (result) => {
      resolve(Boolean(result?.[USE_LOCAL_STORAGE_KEY]));
    });
  });
}

function saveUseLocalPreference(value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [USE_LOCAL_STORAGE_KEY]: Boolean(value) }, () => resolve());
  });
}

function getTargetBaseUrl() {
  const useLocal = Boolean(useLocalInput?.checked);
  return useLocal ? LOCAL_APP_BASE_URL : PROD_APP_BASE_URL;
}

function getTargetLabel() {
  return useLocalInput?.checked ? "local" : "cloud";
}

async function initializeTargetToggle() {
  if (!useLocalInput) {
    return;
  }

  const useLocal = await loadUseLocalPreference();
  useLocalInput.checked = useLocal;

  useLocalInput.addEventListener("change", async () => {
    await saveUseLocalPreference(useLocalInput.checked);
    setStatus(`Using ${getTargetLabel()} app target`);
  });
}

async function openOrReuseAppTab(baseUrl, url) {
  const existingTabs = await chrome.tabs.query({ url: getAppTabPattern(baseUrl) });

  if (existingTabs.length > 0) {
    const existingTab = existingTabs[0];
    await chrome.tabs.update(existingTab.id, { url, active: true });

    if (typeof existingTab.windowId === "number") {
      await chrome.windows.update(existingTab.windowId, { focused: true });
    }
    return;
  }

  await chrome.tabs.create({ url });
}

async function openAppForImport(importUrl) {
  const targetBaseUrl = getTargetBaseUrl();
  const existingTarget = await findOpenAppBaseUrl(targetBaseUrl);

  if (existingTarget) {
    await openOrReuseAppTab(existingTarget, importUrl);
    return;
  }

  await chrome.tabs.create({ url: importUrl });
}

async function scrapeCurrentPage() {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    setStatus("No active tab found", true);
    return null;
  }

  let result = {
    pageTitle: tab.title || "",
    heading: "",
    sourceUrl: tab.url || "",
  };

  try {
    const execution = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const titleEl =
          document.querySelector("h1") ||
          document.querySelector("[data-testid='issue.views.issue-base.foundation.summary.heading']");

        return {
          pageTitle: document.title || "",
          heading: titleEl?.textContent?.trim() || "",
          sourceUrl: window.location.href,
        };
      },
    });

    if (execution?.[0]?.result) {
      result = execution[0].result;
    }
  } catch {
    setStatus("Couldn't auto-read this page. You can still enter fields manually.", true);
  }

  const parsed =
    parseFromText(result.heading) ||
    parseFromText(result.pageTitle) ||
    parseFromUrl(result.sourceUrl) ||
    parseFromUrl(tab.url);

  const hasDetectedData = Boolean(parsed?.jiraId || parsed?.title);
  if (parsed?.jiraId && jiraIdInput && !jiraIdInput.value.trim()) {
    jiraIdInput.value = parsed.jiraId;
  }
  if (parsed?.title && titleInput && !titleInput.value.trim()) {
    titleInput.value = parsed.title;
  }

  if (!hasDetectedData) {
    setStatus("Could not fully detect ticket details. Fill missing fields manually.", true);
  }

  return {
    sourceUrl: result.sourceUrl || "",
  };
}

async function openAppWithImport() {
  try {
    const scraped = await scrapeCurrentPage();

    const jiraId = jiraIdInput?.value.trim() || "";
    const title = titleInput?.value.trim() || "";

    if (!jiraId || !title) {
      setStatus("Ticket ID and title are required", true);
      return;
    }

    const sourceUrl = scraped?.sourceUrl || (await getActiveTab())?.url || "";
    const targetBaseUrl = getTargetBaseUrl();

    const url = new URL(targetBaseUrl.replace(/\/$/, "") + "/");
    url.searchParams.set("import", "1");
    url.searchParams.set("jiraId", jiraId);
    url.searchParams.set("title", title);
    if (sourceUrl) url.searchParams.set("sourceUrl", sourceUrl);

    await openAppForImport(url.toString());
    setStatus(`Opening Task Pilot (${getTargetLabel()})...`);
  } catch {
    setStatus("Unable to open Task Pilot. Check the target mode and try again.", true);
  }
}

(async function init() {
  await initializeTargetToggle();
  void scrapeCurrentPage();

  const importBtn = document.getElementById("importBtn");
  if (importBtn) {
    importBtn.addEventListener("click", () => {
      void openAppWithImport();
    });
  }
})();
