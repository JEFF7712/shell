import { describe, expect, it } from "vitest";
import { recommendedNiriBinding } from "../../src/ipc/commands.js";

describe("ipc helper", () => {
  it("recommends a launcher toggle binding", () => {
    expect(recommendedNiriBinding()).toContain("call launcher toggle");
  });
});
