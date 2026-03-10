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

type PackageManager = "pnpm" | "npm";

export function verifyCommands(pm: PackageManager = "pnpm") {
  const commands =
    pm === "pnpm"
      ? ["pnpm typecheck", "pnpm vitest"]
      : ["npm run typecheck", "npm test"];
  if (hasLintScript()) {
    commands.push(pm === "pnpm" ? "pnpm lint" : "npm run lint");
  }
  return commands;
}
