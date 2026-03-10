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

export interface NotificationController {
  push(entry: Notification): void;
  dismissByKeyboard(id: string): void;
  dismissByMouse(id: string): void;
  count(): number;
}

export function createNotificationController(): NotificationController {
  const entries: Notification[] = [];

  const removeEntry = (id: string) => {
    const index = entries.findIndex((entry) => entry.id === id);
    if (index >= 0) {
      entries.splice(index, 1);
    }
  };

  return {
    push(entry: Notification) {
      entries.push(entry);
    },
    dismissByKeyboard(id: string) {
      removeEntry(id);
    },
    dismissByMouse(id: string) {
      removeEntry(id);
    },
    count() {
      return entries.length;
    },
  };
}
