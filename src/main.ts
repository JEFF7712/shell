import { ShellState } from "./types.js";

export function startShell(opts: { dryRun: boolean }): ShellState {
  return { modules: ["bar", "launcher", "notifications"] };
}
