import { describe, expect, it } from "vitest";
import { verifyCommands } from "../scripts/verify.ts";

describe("verification", () => {
  it("lists required checks", () => {
    expect(verifyCommands()).toContain("pnpm vitest");
  });

  it("supports npm fallback commands", () => {
    expect(verifyCommands("npm")).toContain("npm run typecheck");
    expect(verifyCommands("npm")).toContain("npm test");
  });
});
