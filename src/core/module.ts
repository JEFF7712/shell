import type { CommandBus } from "./commands.js";

export type ModuleId = "launcher" | "notifications" | "bar";

export interface ModuleContract {
  id: ModuleId;
  bootstrap?(bus: CommandBus): void;
}
