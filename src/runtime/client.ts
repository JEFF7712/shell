import type { ShellCommand } from "../core/commands.js";

const DEFAULT_PORT = 3000;

export function runtimeBaseUrl(portOrBase?: number | string): string {
  if (typeof portOrBase === "string") {
    return portOrBase;
  }

  const port = portOrBase ?? DEFAULT_PORT;
  return `http://127.0.0.1:${port}`;
}

export async function sendCommandToRuntime(
  command: ShellCommand,
  base?: number | string
): Promise<void> {
  const baseUrl = runtimeBaseUrl(base);
  const response = await fetch(`${baseUrl}/api/command`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ command }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to send command to runtime (${response.status}): ${body}`
    );
  }
}
