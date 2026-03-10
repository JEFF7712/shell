import { describe, expect, it } from "vitest";
import { createRuntimeState, reduceRuntimeState } from "../../src/runtime/state.js";

describe("runtime state", () => {
  it("toggles launcher visibility via launcher.toggle", () => {
    const initial = createRuntimeState();
    const next = reduceRuntimeState(initial, { type: "launcher.toggle" });
    expect(next.launcherVisible).toBe(true);
  });

  it("dismisses all notifications", () => {
    const initial = createRuntimeState({
      notifications: [
        { id: "1", title: "A", body: "B", priority: "normal", state: "unread", createdAt: "now" },
      ],
    });
    const next = reduceRuntimeState(initial, { type: "notifications.dismissAll" });
    expect(next.notifications).toEqual([]);
  });
});
