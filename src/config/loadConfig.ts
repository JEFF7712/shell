import { join } from "node:path";
import { CONFIG_PATH_SEGMENTS } from "./defaults.js";
import type { ShellConfigSchema } from "./schema.js";

export interface ResolveConfigPathOptions {
  home: string;
}

export function resolveConfigPath({ home }: ResolveConfigPathOptions): string {
  return join(home, ...CONFIG_PATH_SEGMENTS);
}

export type { ShellConfigSchema } from "./schema.js";
export { defaultShellConfig } from "./schema.js";
