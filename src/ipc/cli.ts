import type { CommandBus } from "../core/commands.js";
import {
  dispatchIpcCommand,
  lookupIpcCommand,
  type IpcCommandDefinition,
} from "./commands.js";

export type ParsedIpcArgs = {
  command: string;
  tokens: readonly string[];
  definition: IpcCommandDefinition;
};

export function parseIpcArgs(args: readonly string[]): ParsedIpcArgs {
  const definition = lookupIpcCommand(args);

  if (!definition) {
    throw new Error(`Unknown IPC command: ${args.join(" ")}`);
  }

  return {
    command: definition.command.type,
    tokens: args,
    definition,
  };
}

export function runIpcCommand(
  bus: CommandBus,
  args: readonly string[]
): void {
  const parsed = parseIpcArgs(args);
  dispatchIpcCommand(bus, parsed.tokens);
}
