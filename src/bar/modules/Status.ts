import type { StatusActionKey } from "../../system/openers.js";

export type StatusState = "ok" | "muted" | "alert";

export interface StatusItem {
  id: string;
  label: string;
  icon: string;
  state: StatusState;
  tooltip: string;
  actionKey: StatusActionKey;
}

export interface StatusModuleModel {
  items: StatusItem[];
  ariaLabel: string;
}

const STATUS_ITEMS: StatusItem[] = [
  {
    id: "status-wifi",
    label: "Wi-Fi",
    icon: "wifi",
    state: "ok",
    tooltip: "Network connected",
    actionKey: "wifi"
  },
  {
    id: "status-battery",
    label: "Battery",
    icon: "battery",
    state: "ok",
    tooltip: "Battery healthy",
    actionKey: "battery"
  },
  {
    id: "status-audio",
    label: "Audio",
    icon: "volume",
    state: "muted",
    tooltip: "Audio muted",
    actionKey: "audio"
  },
  {
    id: "status-notifications",
    label: "Alerts",
    icon: "bell",
    state: "alert",
    tooltip: "2 unread",
    actionKey: "notifications"
  }
];

export function createStatusModuleModel(): StatusModuleModel {
  return {
    items: STATUS_ITEMS,
    ariaLabel: "System status indicators"
  };
}
