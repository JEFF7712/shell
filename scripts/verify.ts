import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageJsonPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "package.json",
);

function hasLintScript(): boolean {
  const raw = readFileSync(packageJsonPath, "utf-8");
  const pkg = JSON.parse(raw) as { scripts?: Record<string, string> };
  const candidate = pkg.scripts?.lint;
  return typeof candidate === "string" && candidate.trim().length > 0;
}

export function verifyCommands() {
  const commands = ["pnpm typecheck", "pnpm vitest"];
  if (hasLintScript()) {
    commands.push("pnpm lint");
  }
  return commands;
}
