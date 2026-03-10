import type { DesktopApp } from "../state.js";
import { createLauncherList } from "./LauncherList.js";
import { dom, type LauncherDomElement } from "./dom.js";

export interface AgsRuntimeInfo {
  codename?: string;
  version?: string;
  environment?: string;
}

export interface LauncherWindowOptions {
  apps: DesktopApp[];
  runtimeInfo?: AgsRuntimeInfo;
  onAppSelect?(app: DesktopApp): void;
}

export interface LauncherWindowHandle {
  backdrop: LauncherDomElement;
  window: LauncherDomElement;
  list: LauncherDomElement;
}

export function createLauncherWindow(
  options: LauncherWindowOptions
): LauncherWindowHandle {
  const runtimeInfo = options.runtimeInfo;
  const backdrop = dom.createElement("div");
  backdrop.className = "launcher-backdrop";

  const windowNode = dom.createElement("section");
  windowNode.className = "launcher-window";
  windowNode.setAttribute("role", "dialog");
  windowNode.setAttribute("aria-modal", "true");

  const runtimeMessage = dom.createElement("p");
  runtimeMessage.className = "launcher-runtime";
  if (runtimeInfo) {
    const codename = runtimeInfo.codename ?? "AGS";
    const version = runtimeInfo.version ? ` v${runtimeInfo.version}` : "";
    const environment = runtimeInfo.environment ? ` · ${runtimeInfo.environment}` : "";
    runtimeMessage.textContent = `${codename}${version}${environment}`;
  } else {
    runtimeMessage.textContent = "AGS runtime initializing…";
  }

  const list = createLauncherList(options.apps, {
    onSelect: options.onAppSelect
  });

  windowNode.append(runtimeMessage, list);
  backdrop.append(windowNode);

  return {
    backdrop,
    window: windowNode,
    list
  };
}
