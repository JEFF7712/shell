import { ShellState } from "./types";

export function startShell(): ShellState {
  return { modules: ["bar", "launcher", "notifications"] };
}
