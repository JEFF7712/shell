import { describe, expect, it } from "vitest";
import { verifyCommands } from "../scripts/verify.ts";

describe("verification", () => {
  it("lists required checks", () => {
    expect(verifyCommands()).toContain("pnpm vitest");
  });
});
