import { describe, expect, it } from "vitest";
import { createCommandBus } from "../../src/core/commands.js";
import { runCli } from "../../src/cli.js";

describe("cli entrypoint", () => {
  it("dispatches launcher toggle through ipc mode", () => {
    const bus = createCommandBus();
    const calls: string[] = [];

    bus.on("launcher.toggle", () => {
      calls.push("launcher.toggle");
    });

    const result = runCli(["ipc", "call", "launcher", "toggle"], bus);
    expect(result.mode).toBe("ipc");
    expect(calls).toEqual(["launcher.toggle"]);
  });

  it("supports npm style separator before ipc args", () => {
    const bus = createCommandBus();
    const calls: string[] = [];

    bus.on("launcher.toggle", () => {
      calls.push("launcher.toggle");
    });

    const result = runCli(["--", "ipc", "call", "launcher", "toggle"], bus);
    expect(result.mode).toBe("ipc");
    expect(calls).toEqual(["launcher.toggle"]);
  });

  it("supports tsx style argv with script path prefix", () => {
    const bus = createCommandBus();
    const calls: string[] = [];

    bus.on("launcher.toggle", () => {
      calls.push("launcher.toggle");
    });

    const result = runCli(
      ["/home/rupan/projects/shell/src/cli.ts", "ipc", "call", "launcher", "toggle"],
      bus
    );
    expect(result.mode).toBe("ipc");
    expect(calls).toEqual(["launcher.toggle"]);
  });

  it("starts shell when no subcommand is provided", () => {
    const result = runCli([]);
    expect(result.mode).toBe("start");
    if (result.mode !== "start") {
      throw new Error("Expected start mode");
    }
    expect(result.modules).toEqual(["bar", "launcher", "notifications"]);
  });
});
