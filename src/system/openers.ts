export type StatusActionKey = "wifi" | "battery" | "audio" | "notifications";

export type StatusOpenerAction =
  | "openWifiApp"
  | "openBatteryApp"
  | "openAudioApp"
  | "openNotificationsApp";

const STATUS_ACTIONS: Record<StatusActionKey, StatusOpenerAction> = {
  wifi: "openWifiApp",
  battery: "openBatteryApp",
  audio: "openAudioApp",
  notifications: "openNotificationsApp"
};

export function statusActionFor(key: StatusActionKey): StatusOpenerAction {
  return STATUS_ACTIONS[key];
}
