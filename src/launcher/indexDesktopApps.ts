import { DesktopApp } from "./state.js";

const builtinApps: DesktopApp[] = [
  { id: "terminal", name: "Amber Terminal" },
  { id: "browser", name: "Amber Browser" },
  { id: "settings", name: "Amber Settings" }
];

export async function indexDesktopApps(): Promise<DesktopApp[]> {
  return [...builtinApps];
}
