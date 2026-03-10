import type { DesktopApp } from "../state.js";
import { dom, type LauncherDomElement } from "./dom.js";

export interface LauncherListOptions {
  onSelect?(app: DesktopApp): void;
}

export function createLauncherList(
  apps: DesktopApp[],
  options?: LauncherListOptions
): LauncherDomElement {
  const list = dom.createElement("div");
  list.className = "launcher-list";

  for (const app of apps) {
    const item = dom.createElement("button");
    item.className = "launcher-list-item";
    item.setAttribute("type", "button");
    item.setAttribute("aria-label", app.name);

    const icon = dom.createElement("span");
    icon.className = "launcher-icon";
    icon.textContent = (app.name[0] ?? "").toUpperCase() || "…";

    const title = dom.createElement("span");
    title.className = "launcher-app-name";
    title.textContent = app.name;

    item.append(icon, title);
    item.addEventListener("click", () => {
      options?.onSelect?.(app);
    });

    list.append(item);
  }

  return list;
}
