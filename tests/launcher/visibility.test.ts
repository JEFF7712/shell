import { describe, expect, it } from "vitest";
import { createLauncherController } from "../../src/launcher/state.js";

describe("createLauncherController", () => {
  it("becomes visible after toggle", () => {
    const controller = createLauncherController();

    controller.toggle();

    expect(controller.isVisible).toBe(true);
  });
});
