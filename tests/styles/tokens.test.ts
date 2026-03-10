import { describe, expect, it } from "vitest";
import { amberAccent } from "../../src/styles/tokens.js";

describe("style tokens", () => {
  it("shares the amber accent for the visual system", () => {
    expect(amberAccent).toBe("#f7c74c");
  });
});
