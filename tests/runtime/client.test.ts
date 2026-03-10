import { afterEach, describe, expect, it } from "vitest";
import { sendCommandToRuntime } from "../../src/runtime/client.js";
import { startUiServer, type UiServerHandle } from "../../src/runtime/server.js";

let handle: UiServerHandle | undefined;

afterEach(async () => {
  if (handle) {
    await handle.stop();
    handle = undefined;
  }
});

describe("runtime client", () => {
  it("posts commands to running UI server", async () => {
    handle = await startUiServer({ port: 0 });

    const beforeResp = await fetch(`${handle.baseUrl}/api/state`);
    const before = await beforeResp.json() as { launcherVisible: boolean };
    expect(before.launcherVisible).toBe(false);

    await sendCommandToRuntime({ type: "launcher.toggle" }, handle.baseUrl);

    const afterResp = await fetch(`${handle.baseUrl}/api/state`);
    const after = await afterResp.json() as { launcherVisible: boolean };
    expect(after.launcherVisible).toBe(true);
  });
});
