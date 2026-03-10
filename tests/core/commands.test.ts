import { describe, expect, it, vi } from "vitest";
import { createCommandBus } from "../../src/core/commands.js";

describe("createCommandBus", () => {
  it("dispatches launcher.toggle listeners", () => {
    const commandBus = createCommandBus();
    const handler = vi.fn();

    commandBus.on("launcher.toggle", handler);
    commandBus.dispatch({ type: "launcher.toggle" });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("delivers bar.setVisibility payloads", () => {
    const commandBus = createCommandBus();
    const handler = vi.fn();
    const command = { type: "bar.setVisibility", payload: { visible: true } } as const;

    commandBus.on("bar.setVisibility", handler);
    commandBus.dispatch(command);

    expect(handler).toHaveBeenCalledWith(command);
  });

  it("does not call listeners after unsubscribe", () => {
    const commandBus = createCommandBus();
    const handler = vi.fn();

    const unsubscribe = commandBus.on("notifications.dismissAll", handler);
    unsubscribe();
    commandBus.dispatch({ type: "notifications.dismissAll" });

    expect(handler).not.toHaveBeenCalled();
  });
});
