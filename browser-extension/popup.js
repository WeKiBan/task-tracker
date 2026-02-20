const BUILTIN_APP_BASE_URLS = [
  "http://127.0.0.1:5001/",
  "http://localhost:5001/",
  "https://wekiban.github.io/task-tracker/",
];
const DEFAULT_APP_BASE_URL = BUILTIN_APP_BASE_URLS[BUILTIN_APP_BASE_URLS.length - 1];
const APP_BASE_URL_STORAGE_KEY = "taskPilotAppBaseUrl";

const jiraIdInput = document.getElementById("jiraId");
const titleInput = document.getElementById("title");
const appBaseUrlInput = document.getElementById("appBaseUrl");
const statusEl = document.getElementById("status");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b00020" : "#1a7f37";
}

function parseFromText(text) {
  if (!text) return null;
  const match = text.match(/\b([A-Z][A-Z0-9]+-\d+)\b/);
  if (!match) return null;

  const jiraId = match[1];
  const title = text
    .replace(jiraId, "")
    .replace(/\s*-\s*Jira.*$/i, "")
    .replace(/^\s*\[[^\]]*\]\s*/, "")
    .replace(/^[-:|\s]+/, "")
    .trim();

  return {
    jiraId,
    title: title || text.trim(),
  };
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function normalizeBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;

  try {
    const normalized = new URL(trimmed);
    return normalized.toString().replace(/\/?$/, "/");
  } catch {
    return null;
  }
}

function getCandidateBaseUrls(preferredBaseUrl) {
  const urls = [preferredBaseUrl, ...BUILTIN_APP_BASE_URLS]
    .map(normalizeBaseUrl)
    .filter(Boolean);

  return [...new Set(urls)];
}

function getAppTabPattern(baseUrl) {
  const appUrl = new URL(baseUrl);
  return `${appUrl.origin}${appUrl.pathname}*`;
}

async function findOpenAppBaseUrl(candidateBaseUrls) {
  for (const baseUrl of candidateBaseUrls) {
    const existingTabs = await chrome.tabs.query({ url: getAppTabPattern(baseUrl) });
    if (existingTabs.length > 0) {
      return baseUrl;
    }
  }

  return null;
}

function loadStoredAppBaseUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get([APP_BASE_URL_STORAGE_KEY], (result) => {
      resolve(normalizeBaseUrl(result?.[APP_BASE_URL_STORAGE_KEY]) || null);
    });
  });
}

function saveStoredAppBaseUrl(baseUrl) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [APP_BASE_URL_STORAGE_KEY]: baseUrl }, () => resolve());
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

  const parsed = parseFromText(result.heading) || parseFromText(result.pageTitle);

  const hasDetectedData = Boolean(parsed?.jiraId || parsed?.title);
  if (parsed?.jiraId && !jiraIdInput.value.trim()) {
    jiraIdInput.value = parsed.jiraId;
  }
  if (parsed?.title && !titleInput.value.trim()) {
    titleInput.value = parsed.title;
  }

  if (!hasDetectedData) {
    setStatus("Could not fully detect ticket details. Fill missing fields.", true);
  }

  return {
    sourceUrl: result.sourceUrl || "",
  };
}

async function openAppWithImport() {
  try {
    const scraped = await scrapeCurrentPage();

    const jiraId = jiraIdInput.value.trim();
    const title = titleInput.value.trim();

    if (!jiraId || !title) {
      setStatus("Ticket ID and title are required", true);
      return;
    }

    const preferredBaseUrl = normalizeBaseUrl(appBaseUrlInput?.value) || DEFAULT_APP_BASE_URL;
    await saveStoredAppBaseUrl(preferredBaseUrl);
    const candidateBaseUrls = getCandidateBaseUrls(preferredBaseUrl);

    const sourceUrl = scraped?.sourceUrl || (await getActiveTab())?.url || "";
    const targetBaseUrl = (await findOpenAppBaseUrl(candidateBaseUrls)) || preferredBaseUrl;

    const url = new URL(targetBaseUrl.replace(/\/$/, "") + "/");
    url.searchParams.set("import", "1");
    url.searchParams.set("jiraId", jiraId);
    url.searchParams.set("title", title);
    if (sourceUrl) url.searchParams.set("sourceUrl", sourceUrl);

    await openOrReuseAppTab(targetBaseUrl, url.toString());
    setStatus("Opening Task Pilot...");
  } catch {
    setStatus("Unable to open Task Pilot. Check the app URL and try again.", true);
  }
}

(async function init() {
  const storedBaseUrl = await loadStoredAppBaseUrl();
  const initialBaseUrl = storedBaseUrl || DEFAULT_APP_BASE_URL;

  if (appBaseUrlInput) {
    appBaseUrlInput.value = initialBaseUrl;
    appBaseUrlInput.addEventListener("change", async () => {
      const normalized = normalizeBaseUrl(appBaseUrlInput.value);
      if (!normalized) {
        setStatus("Please enter a valid app URL", true);
        return;
      }

      appBaseUrlInput.value = normalized;
      await saveStoredAppBaseUrl(normalized);
      setStatus("App URL saved");
    });
  }

  void scrapeCurrentPage();

  document.getElementById("importBtn").addEventListener("click", () => {
    void openAppWithImport();
  });
})();
