import type { CommandBus, ShellCommand } from "../core/commands.js";

export type IpcCommandDefinition = {
  tokens: readonly string[];
  command: ShellCommand;
  description: string;
};

const ipcCommandDefinitions: readonly IpcCommandDefinition[] = [
  {
    tokens: ["call", "launcher", "toggle"],
    command: { type: "launcher.toggle" },
    description: "Toggle the application launcher overlay."
  },
  {
    tokens: ["call", "notifications", "dismiss-all"],
    command: { type: "notifications.dismissAll" },
    description: "Dismiss all visible notifications."
  },
];

export function lookupIpcCommand(
  args: readonly string[]
): IpcCommandDefinition | undefined {
  return ipcCommandDefinitions.find((definition) => {
    if (definition.tokens.length !== args.length) {
      return false;
    }

    return definition.tokens.every((token, index) => token === args[index]);
  });
}

export function dispatchIpcCommand(
  bus: CommandBus,
  args: readonly string[]
): void {
  const definition = lookupIpcCommand(args);

  if (!definition) {
    throw new Error(`Unknown IPC command: ${args.join(" ")}`);
  }

  bus.dispatch(definition.command);
}

export function listIpcCommands(): readonly IpcCommandDefinition[] {
  return ipcCommandDefinitions;
}

const launcherToggleDefinition = ipcCommandDefinitions.find(
  (definition) => definition.command.type === "launcher.toggle"
);

export function recommendedNiriBinding(): string {
  if (!launcherToggleDefinition) {
    throw new Error("Missing launcher toggle IPC definition");
  }

  const spawnTokens = launcherToggleDefinition.tokens
    .map((token) => `"${token}"`)
    .join(" ");

  return [
    `Mod+Space hotkey-overlay-title="App Launcher" {`,
    `    # call launcher toggle`,
    `    spawn "amber-shell" "ipc" ${spawnTokens};`,
    `}`,
  ].join("\n");
}
