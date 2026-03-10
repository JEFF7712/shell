import { describe, expect, it } from "vitest";
import { DesktopApp } from "../../src/launcher/state.js";
import { rankApps } from "../../src/launcher/rank.js";

describe("rankApps", () => {
  it("prefers prefix matches and orders them by recency before fuzzy matches", () => {
    const apps: DesktopApp[] = [
      { id: "recent-prefix", name: "Search Light" },
      { id: "old-prefix", name: "Search Arcade" },
      { id: "fuzzy", name: "Light Search" }
    ];

    const lastUsedAt: Record<string, number> = {
      "recent-prefix": 2,
      "old-prefix": 1,
      fuzzy: 3
    };

    const ordered = rankApps(apps, "search", {
      getLastUsedAt: (appId) => lastUsedAt[appId]
    });

    expect(ordered.map((app) => app.id)).toEqual([
      "recent-prefix",
      "old-prefix",
      "fuzzy"
    ]);
  });
});
