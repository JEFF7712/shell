import { describe, expect, it } from "vitest";
import { shouldShowBar } from "../../src/bar/BarWindow.js";

describe("bar visibility", () => {
  it("hides when a window is fullscreen", () => {
    expect(shouldShowBar({ isFullscreen: true })).toBe(false);
  });

  it("stays visible when not fullscreen", () => {
    expect(shouldShowBar({ isFullscreen: false })).toBe(true);
  });
});
