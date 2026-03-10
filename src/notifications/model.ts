export type NotificationPriority = "info" | "normal" | "critical";
export type NotificationState = "unread" | "read" | "dismissed";

export interface Notification {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  state: NotificationState;
  createdAt: string;
}

export interface NotificationIndicator {
  unreadCount: number;
  hasCriticalUnread: boolean;
}
