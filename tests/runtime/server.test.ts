import { afterEach, describe, expect, it } from "vitest";
import { startUiServer, type UiServerHandle } from "../../src/runtime/server.js";

let handle: UiServerHandle | undefined;

afterEach(async () => {
  if (handle) {
    await handle.stop();
    handle = undefined;
  }
});

describe("ui server", () => {
  it("accepts command endpoint and updates state", async () => {
    handle = await startUiServer({ port: 0 });

    const health = await fetch(`${handle.baseUrl}/health`);
    expect(health.status).toBe(200);

    const initialStateResp = await fetch(`${handle.baseUrl}/api/state`);
    const initialState = await initialStateResp.json() as { launcherVisible: boolean };
    expect(initialState.launcherVisible).toBe(false);

    const commandResp = await fetch(`${handle.baseUrl}/api/command`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ command: { type: "launcher.toggle" } }),
    });
    expect(commandResp.status).toBe(204);

    const nextStateResp = await fetch(`${handle.baseUrl}/api/state`);
    const nextState = await nextStateResp.json() as { launcherVisible: boolean };
    expect(nextState.launcherVisible).toBe(true);
  });
});
