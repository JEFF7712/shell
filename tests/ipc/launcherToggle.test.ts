import { describe, expect, it } from "vitest";
import { parseIpcArgs } from "../../src/ipc/cli.js";

describe("ipc args", () => {
  it("parses launcher toggle command", () => {
    expect(parseIpcArgs(["call", "launcher", "toggle"]).command).toBe(
      "launcher.toggle"
    );
  });

  it("parses notification dismissal", () => {
    expect(
      parseIpcArgs(["call", "notifications", "dismiss-all"]).command
    ).toBe("notifications.dismissAll");
  });

  it("rejects unknown commands", () => {
    expect(() => parseIpcArgs(["call", "unknown"])).toThrow();
  });
});
