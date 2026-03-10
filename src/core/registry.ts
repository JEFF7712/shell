import type { CommandBus } from "./commands.js";
import type { ModuleContract, ModuleId } from "./module.js";

export interface ModuleRegistry {
  register<M extends ModuleContract>(module: M): M;
  get(id: ModuleId): ModuleContract | undefined;
  list(): ModuleContract[];
}

export function createModuleRegistry(bus: CommandBus): ModuleRegistry {
  const modules = new Map<ModuleId, ModuleContract>();

  return {
    register(module) {
      if (modules.has(module.id)) {
        throw new Error(`module '${module.id}' already registered`);
      }

      module.bootstrap?.(bus);
      modules.set(module.id, module);
      return module;
    },
    get(id) {
      return modules.get(id);
    },
    list() {
      return Array.from(modules.values());
    }
  };
}
