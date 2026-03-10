import { describe, expect, it } from "vitest";
import { createStatusModuleModel } from "../../src/bar/modules/Status.js";
import { statusActionFor } from "../../src/system/openers.js";

describe("status click actions", () => {
  it("returns the audio opener action", () => {
    expect(statusActionFor("audio")).toBe("openAudioApp");
  });

  it("resolves opener actions for every status item", () => {
    const { items } = createStatusModuleModel();
    const actions = items.map((item) => statusActionFor(item.actionKey));

    expect(actions).toEqual([
      "openWifiApp",
      "openBatteryApp",
      "openAudioApp",
      "openNotificationsApp"
    ]);
  });
});
