import { describe, expect, it } from "vitest";
import { startShell } from "../../src/main.js";

describe("startShell", () => {
  it("returns the required modules", () => {
    const shell = startShell({ dryRun: true });
    expect(shell.modules).toEqual(["bar", "launcher", "notifications"]);
  });
});
