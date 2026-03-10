import { DesktopApp } from "./state.js";

export interface RankOptions {
  getLastUsedAt?: (appId: string) => number | undefined;
}

export function rankApps(
  apps: DesktopApp[],
  query: string,
  options?: RankOptions
): DesktopApp[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [...apps];
  }

  const getLastUsedAt = options?.getLastUsedAt ?? (() => undefined);

  const scored = apps
    .map((app) => {
      const normalizedName = app.name.toLowerCase();
      const prefixMatch = normalizedName.startsWith(normalizedQuery) ? 1 : 0;
      const fuzzyMatch = prefixMatch || normalizedName.includes(normalizedQuery) ? 1 : 0;
      return {
        app,
        prefixMatch,
        fuzzyMatch,
        lastUsedAt: getLastUsedAt(app.id)
      };
    })
    .filter((entry) => entry.fuzzyMatch > 0);

  scored.sort((a, b) => {
    if (a.prefixMatch !== b.prefixMatch) {
      return b.prefixMatch - a.prefixMatch;
    }

    if (a.prefixMatch && b.prefixMatch) {
      const aLast = a.lastUsedAt ?? 0;
      const bLast = b.lastUsedAt ?? 0;
      if (aLast !== bLast) {
        return bLast - aLast;
      }
    }

    if (a.fuzzyMatch !== b.fuzzyMatch) {
      return b.fuzzyMatch - a.fuzzyMatch;
    }

    return a.app.name.localeCompare(b.app.name);
  });

  return scored.map((entry) => entry.app);
}
