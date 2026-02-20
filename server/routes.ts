import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";

type ProjectInput = {
  name: string;
  repoUrl: string;
};

function runCommand(command: string, args: string[]) {
  return new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function normalizeReleaseNotes(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const normalized = trimmed.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  return normalized.replace(/^\[?[A-Z][A-Z0-9_]+-\d+\]?\s*[:\-–—]?\s*/i, "").trim();
}

function isLocalPath(value: string) {
  return /^(~\/|\/|[A-Za-z]:[\\/]|\\\\)/.test(value);
}

function toWebRepoUrl(repo: string) {
  const trimmed = repo.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\.git$/i, "").replace(/\/+$/, "");
  }

  const sshMatch = trimmed.match(/^git@([^:]+):(.+)$/i);
  if (sshMatch) {
    const [, host, path] = sshMatch;
    return `https://${host}/${path.replace(/\.git$/i, "")}`;
  }

  const sshUrlMatch = trimmed.match(/^ssh:\/\/git@([^/]+)\/(.+)$/i);
  if (sshUrlMatch) {
    const [, host, path] = sshUrlMatch;
    return `https://${host}/${path.replace(/\.git$/i, "")}`;
  }

  return "";
}

async function getLatestLocalTagInfo(path: string) {
  const tagInfo = await runCommand("git", [
    "-C",
    path,
    "for-each-ref",
    "refs/tags",
    "--sort=-v:refname",
    "--count=1",
    "--format=%(refname:short)||%(contents:body)||%(contents:subject)",
  ]);

  const remoteInfo = await runCommand("git", ["-C", path, "config", "--get", "remote.origin.url"]);
  const remoteUrl = remoteInfo.code === 0 ? remoteInfo.stdout.trim() : "";

  if (tagInfo.code !== 0 || !tagInfo.stdout.trim()) {
    return {
      tag: "",
      releaseNotes: "No tags found.",
      remoteUrl,
    };
  }

  const [tag = "", releaseNotesBody = "", releaseNotesSubject = ""] = tagInfo.stdout.trim().split("||");
  const releaseNotes =
    normalizeReleaseNotes(releaseNotesBody) ||
    normalizeReleaseNotes(releaseNotesSubject) ||
    "No release notes available.";

  return {
    tag,
    releaseNotes,
    remoteUrl,
  };
}

async function getLatestRemoteTag(repoUrl: string) {
  const remoteTags = await runCommand("git", ["ls-remote", "--tags", "--sort=-v:refname", repoUrl]);
  if (remoteTags.code !== 0 || !remoteTags.stdout.trim()) {
    return "";
  }

  const refs = remoteTags.stdout
    .split("\n")
    .map((line) => line.trim().split(/\s+/)[1] || "")
    .filter((ref) => ref.startsWith("refs/tags/") && !ref.endsWith("^{}"))
    .map((ref) => ref.replace("refs/tags/", ""));

  return refs[0] || "";
}

function buildTagUrl(repoUrl: string, tag: string, remoteUrl?: string) {
  if (!tag) {
    return "";
  }

  const webRepo = toWebRepoUrl(remoteUrl || repoUrl);
  if (!webRepo) {
    return "";
  }

  return `${webRepo}/-/tags/${encodeURIComponent(tag)}`;
}

function sanitizePathSegment(value: string, fallback: string) {
  const safe = value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  return safe || fallback;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // No API routes needed - frontend uses localStorage.
  // We just serve the frontend (handled by server/index.ts and vite.ts)

  app.get("/api/health", async (req, res) => {
    const healthy = await storage.healthCheck();
    res.json({ status: healthy ? "ok" : "error" });
  });

  app.get("/api/pick-project-folder", async (_req, res) => {
    if (process.platform !== "darwin") {
      return res.status(501).json({ message: "Folder picker API currently supports macOS only." });
    }

    const script = 'POSIX path of (choose folder with prompt "Select project folder")';
    const result = await runCommand("osascript", ["-e", script]);

    if (result.code !== 0) {
      return res.status(500).json({
        message: "Unable to select folder.",
        detail: result.stderr || result.stdout,
      });
    }

    const folderPath = result.stdout.trim();
    if (!folderPath) {
      return res.status(400).json({ message: "No folder selected." });
    }

    return res.json({ path: folderPath });
  });

  app.post("/api/open-project-in-gitkraken", async (req, res) => {
    const target = typeof req.body?.target === "string" ? req.body.target.trim() : "";

    if (!target) {
      return res.status(400).json({ message: "Missing project target." });
    }

    if (process.platform === "darwin") {
      const result = await runCommand("open", ["-a", "GitKraken", target]);
      if (result.code !== 0) {
        return res.status(500).json({
          message: "Unable to open project in GitKraken.",
          detail: result.stderr || result.stdout,
        });
      }

      return res.json({ ok: true });
    }

    return res.status(501).json({ message: "Open-in-GitKraken API currently supports macOS only." });
  });

  app.post("/api/open-project-in-vscode", async (req, res) => {
    const target = typeof req.body?.target === "string" ? req.body.target.trim() : "";

    if (!target) {
      return res.status(400).json({ message: "Missing project target." });
    }

    const localTarget = target.startsWith("~/")
      ? `${process.env.HOME || ""}${target.slice(1)}`
      : target;

    if (!isLocalPath(localTarget)) {
      return res.status(400).json({ message: "Only local project paths are supported for VS Code opening." });
    }

    const result = await runCommand("code", ["-n", localTarget]);
    if (result.code !== 0) {
      return res.status(500).json({
        message: "Unable to open project in a new VS Code window. Ensure the 'code' CLI is installed.",
        detail: result.stderr || result.stdout,
      });
    }

    return res.json({ ok: true });
  });

  app.post("/api/open-browser-extension-folder", async (_req, res) => {
    const extensionPath = path.resolve(process.cwd(), "browser-extension");

    try {
      const stats = await fs.stat(extensionPath);
      if (!stats.isDirectory()) {
        return res.status(404).json({ message: "Browser extension folder was not found." });
      }
    } catch {
      return res.status(404).json({ message: "Browser extension folder was not found." });
    }

    if (process.platform === "darwin") {
      const result = await runCommand("open", [extensionPath]);
      if (result.code !== 0) {
        return res.status(500).json({
          message: "Unable to open the browser extension folder.",
          detail: result.stderr || result.stdout,
        });
      }

      return res.json({ ok: true, path: extensionPath });
    }

    if (process.platform === "win32") {
      const result = await runCommand("explorer", [extensionPath]);
      if (result.code !== 0) {
        return res.status(500).json({
          message: "Unable to open the browser extension folder.",
          detail: result.stderr || result.stdout,
        });
      }

      return res.json({ ok: true, path: extensionPath });
    }

    const linuxResult = await runCommand("xdg-open", [extensionPath]);
    if (linuxResult.code !== 0) {
      return res.status(500).json({
        message: "Unable to open the browser extension folder.",
        detail: linuxResult.stderr || linuxResult.stdout,
      });
    }

    return res.json({ ok: true, path: extensionPath });
  });

  app.post("/api/upload-note-image", async (req, res) => {
    const taskIdRaw = typeof req.body?.taskId === "string" ? req.body.taskId.trim() : "";
    const userIdRaw = typeof req.body?.userId === "string" ? req.body.userId.trim() : "anonymous";
    const dataUrl = typeof req.body?.dataUrl === "string" ? req.body.dataUrl.trim() : "";

    if (!taskIdRaw || !dataUrl) {
      return res.status(400).json({ message: "Missing taskId or dataUrl." });
    }

    const dataUrlMatch = dataUrl.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,([a-zA-Z0-9+/=\s]+)$/i);
    if (!dataUrlMatch) {
      return res.status(400).json({ message: "Invalid image payload." });
    }

    const mimeType = dataUrlMatch[1].toLowerCase();
    const base64Payload = dataUrlMatch[2].replace(/\s/g, "");

    if (base64Payload.length > 15 * 1024 * 1024) {
      return res.status(413).json({ message: "Image is too large." });
    }

    const ext = mimeType === "image/png"
      ? "png"
      : mimeType === "image/webp"
        ? "webp"
        : "jpg";

    const taskId = sanitizePathSegment(taskIdRaw, "task");
    const userId = sanitizePathSegment(userIdRaw, "anonymous");
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const relativeDir = path.join("task-notes", userId, taskId);
    const absoluteDir = path.resolve(process.cwd(), "uploads", relativeDir);

    try {
      await fs.mkdir(absoluteDir, { recursive: true });
      const absolutePath = path.join(absoluteDir, fileName);
      const buffer = Buffer.from(base64Payload, "base64");
      await fs.writeFile(absolutePath, buffer);

      const relativeUrl = `/uploads/${relativeDir.split(path.sep).join("/")}/${fileName}`;
      return res.json({ url: relativeUrl });
    } catch (error) {
      console.error("Failed to save uploaded note image:", error);
      return res.status(500).json({ message: "Unable to save image." });
    }
  });

  app.post("/api/projects/generate-comment", async (req, res) => {
    const projects = Array.isArray(req.body?.projects) ? (req.body.projects as ProjectInput[]) : [];

    if (projects.length === 0) {
      return res.status(400).json({ message: "No projects provided." });
    }

    const lines: string[] = [];

    for (const project of projects) {
      const name = String(project?.name || "").trim();
      const repoUrl = String(project?.repoUrl || "").trim();

      if (!name || !repoUrl) {
        continue;
      }

      if (isLocalPath(repoUrl)) {
        const info = await getLatestLocalTagInfo(repoUrl);
        const briefSummary = info.releaseNotes || "No release notes available.";
        const tagUrl = buildTagUrl(repoUrl, info.tag, info.remoteUrl);
        const webRepo = toWebRepoUrl(info.remoteUrl || repoUrl);
        const projectLabel = webRepo ? `[${name}](${webRepo})` : name;
        const tagPart = info.tag
          ? (tagUrl ? `[${info.tag}](${tagUrl})` : info.tag)
          : "No tag found";
        lines.push(`${projectLabel}: ${tagPart} - ${briefSummary}`);
        continue;
      }

      const latestTag = await getLatestRemoteTag(repoUrl);
      if (!latestTag) {
        const webRepo = toWebRepoUrl(repoUrl);
        const projectLabel = webRepo ? `[${name}](${webRepo})` : name;
        lines.push(`${projectLabel}: No tag found - No tag description available.`);
        continue;
      }

      const tagUrl = buildTagUrl(repoUrl, latestTag);
      const webRepo = toWebRepoUrl(repoUrl);
      const projectLabel = webRepo ? `[${name}](${webRepo})` : name;
      const tagPart = tagUrl ? `[${latestTag}](${tagUrl})` : latestTag;
      lines.push(`${projectLabel}: ${tagPart} - remote repo URL only (clone locally for change summary).`);
    }

    const comment = `Projects modified:\n\n${lines.join("\n\n")}`;
    return res.json({ comment, lines });
  });

  return httpServer;
}
