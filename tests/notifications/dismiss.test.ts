import { test, expect } from "vitest";
import {
  createNotificationController,
} from "../../src/notifications/model.js";
import type { Notification } from "../../src/notifications/model.js";

const makeNotification = (
  overrides: Partial<Notification> = {}
): Notification => ({
  id: overrides.id ?? Math.random().toString(36).slice(2),
  title: overrides.title ?? "dismiss test",
  body: overrides.body ?? "",
  priority: overrides.priority ?? "normal",
  state: overrides.state ?? "unread",
  createdAt: overrides.createdAt ?? new Date().toISOString(),
});

test("keyboard dismissal removes entry", () => {
  const controller = createNotificationController();
  const entry = makeNotification({ id: "kbd-1" });

  controller.push(entry);
  expect(controller.count()).toBe(1);

  controller.dismissByKeyboard(entry.id);
  expect(controller.count()).toBe(0);
});

test("mouse dismissal removes entry", () => {
  const controller = createNotificationController();
  const entry = makeNotification({ id: "mouse-1" });

  controller.push(entry);
  expect(controller.count()).toBe(1);

  controller.dismissByMouse(entry.id);
  expect(controller.count()).toBe(0);
});
