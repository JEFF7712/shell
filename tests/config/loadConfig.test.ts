import { describe, expect, it } from "vitest";
import { resolveConfigPath } from "../../src/config/loadConfig.js";

describe("resolveConfigPath", () => {
  it("builds the default config path from the home directory", () => {
    expect(resolveConfigPath({ home: "/home/u" })).toBe("/home/u/.config/amber-shell/config.ts");
  });
});
