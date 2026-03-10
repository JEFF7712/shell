import type { Notification, NotificationIndicator } from "./model.js";

export function filterPersisted(notifications: Notification[]): Notification[] {
  return notifications.filter(
    (notification) => notification.state === "unread" || notification.priority === "critical",
  );
}

export function buildIndicatorSummary(notifications: Notification[]): NotificationIndicator {
  const unread = notifications.filter((notification) => notification.state === "unread");

  return {
    unreadCount: unread.length,
    hasCriticalUnread: unread.some((notification) => notification.priority === "critical"),
  };
}
