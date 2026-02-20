import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { spawn } from "child_process";
import path from "path";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "20mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "20mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function openInBrowser(url: string) {
  const commandByPlatform: Record<string, string> = {
    darwin: "open",
    win32: "start",
    linux: "xdg-open",
  };

  const command = commandByPlatform[process.platform];
  if (!command) {
    return;
  }

  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const launcher = process.platform === "win32" ? "cmd" : command;

  const child = spawn(launcher, args, {
    stdio: "ignore",
    detached: true,
  });
  child.unref();
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const envPort = Number.parseInt(process.env.PORT ?? "", 10);
  const initialPort = Number.isNaN(envPort) ? 5001 : envPort;

  const listenOnPort = (port: number) => {
    const onError = (error: NodeJS.ErrnoException) => {
      httpServer.off("error", onError);

      if (error.code === "EADDRINUSE" && Number.isNaN(envPort)) {
        const nextPort = port + 1;
        log(`port ${port} in use, retrying on ${nextPort}`);
        listenOnPort(nextPort);
        return;
      }

      throw error;
    };

    httpServer.once("error", onError);
    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
      },
      () => {
        httpServer.off("error", onError);
        log(`serving on port ${port}`);
        if (process.env.OPEN_BROWSER === "true") {
          openInBrowser(`http://localhost:${port}`);
        }
      },
    );
  };

  listenOnPort(initialPort);
})();
