import { describe, expect, it } from "vitest";
import { startShell } from "../../src/main";

describe("startShell", () => {
  it("returns the required modules", () => {
    const shell = startShell();
    expect(shell.modules).toEqual(["bar", "launcher", "notifications"]);
  });
});
