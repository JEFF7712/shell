import { test, expect } from "vitest";
import { filterPersisted } from "../../src/notifications/persist.js";
import type { Notification } from "../../src/notifications/model.js";

const makeNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: overrides.id ?? Math.random().toString(36).slice(2),
  title: overrides.title ?? "",
  body: overrides.body ?? "",
  priority: overrides.priority ?? "normal",
  state: overrides.state ?? "read",
  createdAt: overrides.createdAt ?? new Date().toISOString(),
});

test("filterPersisted keeps unread or critical notifications", () => {
  const notifications = [
    makeNotification({ state: "unread", priority: "normal", id: "u1" }),
    makeNotification({ state: "read", priority: "normal", id: "r1" }),
    makeNotification({ state: "read", priority: "critical", id: "c1" }),
    makeNotification({ state: "dismissed", priority: "info", id: "d1" }),
  ];

  const persisted = filterPersisted(notifications);

  expect(persisted.map((entry) => entry.id).sort()).toEqual(["c1", "u1"].sort());
});
