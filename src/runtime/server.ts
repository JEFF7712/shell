import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { ShellCommand } from "../core/commands.js";
import { createRuntimeState, reduceRuntimeState } from "./state.js";

export interface UiServerHandle {
  baseUrl: string;
  port: number;
  stop(): Promise<void>;
}

const DEFAULT_PORT = 3000;

function sendJson(res: ServerResponse, data: unknown, status = 200): void {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(payload).toString(),
  });
  res.end(payload);
}

function sendHtml(res: ServerResponse, html: string): void {
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8",
    "content-length": Buffer.byteLength(html).toString(),
  });
  res.end(html);
}

async function readJson<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    throw new Error("empty body");
  }
  return JSON.parse(raw) as T;
}

function createShellHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Amber Shell Runtime</title>
    <style>
      :root {
        --bg-0: #0c0c0c;
        --bg-1: #151515;
        --bg-2: #1f1f1f;
        --line: #2d2d2d;
        --text: #ececec;
        --muted: #9a9a9a;
        --accent: #d48a1f;
        --accent-soft: #8c5a14;
        --overlay-radius: 3px;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "JetBrains Mono", "Iosevka", "Fira Code", monospace;
        background: radial-gradient(circle at 20% 10%, #1a1a1a 0%, #101010 45%, #090909 100%);
        color: var(--text);
      }

      .bar {
        position: fixed;
        inset: 0 0 auto 0;
        height: 34px;
        border-bottom: 1px solid var(--line);
        background: linear-gradient(180deg, #181818 0%, #121212 100%);
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 0 10px;
        z-index: 60;
      }

      .left, .center, .right { display: flex; align-items: center; gap: 8px; }
      .center { justify-content: center; color: var(--accent); font-size: 13px; }
      .right { justify-content: flex-end; color: var(--muted); font-size: 12px; }

      .ws {
        padding: 2px 7px;
        border: 1px solid var(--line);
        background: var(--bg-2);
        font-size: 11px;
      }

      .ws.active {
        border-color: var(--accent-soft);
        color: var(--accent);
      }

      .launcher {
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.45);
        z-index: 100;
      }

      .launcher.visible { display: flex; }

      .launcher-panel {
        width: min(620px, calc(100vw - 24px));
        border: 1px solid var(--line);
        border-radius: var(--overlay-radius);
        background: var(--bg-1);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
        overflow: hidden;
      }

      .launcher-head {
        padding: 10px 12px;
        border-bottom: 1px solid var(--line);
        color: var(--muted);
        font-size: 12px;
      }

      .app-list { list-style: none; margin: 0; padding: 8px; display: grid; gap: 6px; }

      .app {
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid var(--line);
        background: #1a1a1a;
        padding: 8px 10px;
        border-radius: var(--overlay-radius);
      }

      .icon {
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--accent-soft);
        color: var(--accent);
        font-size: 12px;
      }

      .notifications {
        position: fixed;
        top: 42px;
        right: 10px;
        width: min(360px, calc(100vw - 20px));
        display: grid;
        gap: 8px;
        z-index: 80;
      }

      .note {
        border: 1px solid var(--line);
        background: #171717;
        border-radius: var(--overlay-radius);
        padding: 9px 10px;
      }

      .note-title { color: var(--text); font-size: 12px; margin: 0 0 3px; }
      .note-body { color: var(--muted); font-size: 11px; margin: 0; }
      .dot { color: var(--accent); }

      .controls {
        position: fixed;
        left: 10px;
        bottom: 10px;
        display: flex;
        gap: 8px;
        z-index: 70;
      }

      button {
        border: 1px solid var(--line);
        background: #1b1b1b;
        color: var(--text);
        padding: 7px 10px;
        border-radius: var(--overlay-radius);
        font-family: inherit;
        font-size: 11px;
        cursor: pointer;
      }

      button:hover { border-color: var(--accent-soft); color: var(--accent); }
    </style>
  </head>
  <body>
    <header class="bar" id="bar">
      <div class="left">
        <span class="ws active">1</span>
        <span class="ws">2</span>
        <span class="ws">3</span>
      </div>
      <div class="center" id="clock">12:00 PM</div>
      <div class="right">
        <span>Wi-Fi</span>
        <span>Bat</span>
        <span>Vol</span>
        <span id="note-indicator"><span class="dot">•</span> <span id="note-count">0</span></span>
      </div>
    </header>

    <section class="launcher" id="launcher">
      <div class="launcher-panel">
        <div class="launcher-head">App Launcher</div>
        <ul class="app-list">
          <li class="app"><span class="icon">F</span><span>Firefox</span></li>
          <li class="app"><span class="icon">T</span><span>Terminal</span></li>
          <li class="app"><span class="icon">C</span><span>Code</span></li>
          <li class="app"><span class="icon">D</span><span>Discord</span></li>
        </ul>
      </div>
    </section>

    <section class="notifications" id="notifications"></section>

    <div class="controls">
      <button id="toggle-launcher">Toggle Launcher</button>
      <button id="dismiss-notifications">Dismiss Notifications</button>
    </div>

    <script>
      const launcher = document.getElementById("launcher");
      const bar = document.getElementById("bar");
      const noteCount = document.getElementById("note-count");
      const noteList = document.getElementById("notifications");
      const clock = document.getElementById("clock");

      async function sendCommand(command) {
        await fetch("/api/command", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ command }),
        });
        await refresh();
      }

      async function refresh() {
        const response = await fetch("/api/state");
        if (!response.ok) return;

        const state = await response.json();
        launcher.classList.toggle("visible", state.launcherVisible);
        bar.style.display = state.barVisible ? "grid" : "none";
        noteCount.textContent = String(state.notifications.length);

        noteList.innerHTML = "";
        for (const note of state.notifications) {
          const node = document.createElement("article");
          node.className = "note";
          node.innerHTML = "<p class='note-title'>" + note.title + "</p><p class='note-body'>" + note.body + "</p>";
          noteList.append(node);
        }
      }

      document.getElementById("toggle-launcher").addEventListener("click", () =>
        sendCommand({ type: "launcher.toggle" })
      );

      document.getElementById("dismiss-notifications").addEventListener("click", () =>
        sendCommand({ type: "notifications.dismissAll" })
      );

      setInterval(() => {
        const now = new Date();
        const text = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        clock.textContent = text;
      }, 1000);

      refresh();
      setInterval(refresh, 1000);
    </script>
  </body>
</html>`;
}

export async function startUiServer(opts: { port?: number } = {}): Promise<UiServerHandle> {
  let runtimeState = createRuntimeState({
    notifications: [
      {
        id: "welcome",
        title: "amber-shell",
        body: "Runtime UI online",
        priority: "normal",
        state: "unread",
        createdAt: new Date().toISOString(),
      },
    ],
  });

  const server = createServer(async (req, res) => {
    try {
      const method = req.method ?? "GET";
      const url = new URL(req.url ?? "/", "http://localhost");

      if (method === "GET" && url.pathname === "/health") {
        sendJson(res, { ok: true });
        return;
      }

      if (method === "GET" && url.pathname === "/api/state") {
        sendJson(res, runtimeState);
        return;
      }

      if (method === "POST" && url.pathname === "/api/command") {
        const body = await readJson<{ command: ShellCommand }>(req);
        runtimeState = reduceRuntimeState(runtimeState, body.command);
        res.writeHead(204, { "content-length": "0" });
        res.end();
        return;
      }

      if (method === "GET" && url.pathname === "/") {
        sendHtml(res, createShellHtml());
        return;
      }

      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
    } catch {
      res.writeHead(400, { "content-type": "text/plain" });
      res.end("Invalid request");
    }
  });

  const port = opts.port ?? DEFAULT_PORT;

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  const baseUrl = `http://127.0.0.1:${actualPort}`;

  return {
    baseUrl,
    port: actualPort,
    stop: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      }),
  };
}
