import { createCommandBus, type CommandBus } from "./core/commands.js";
import { runIpcCommand } from "./ipc/cli.js";
import { startShell } from "./main.js";
import { sendCommandToRuntime } from "./runtime/client.js";
import { startUiServer } from "./runtime/server.js";
import { lookupIpcCommand } from "./ipc/commands.js";

export type CliResult =
  | { mode: "ipc" }
  | { mode: "start"; modules: readonly string[] };

function normalizeArgs(args: readonly string[]): readonly string[] {
  let normalized = args;

  const first = normalized[0] ?? "";
  if ((first.endsWith(".ts") || first.endsWith(".js")) && normalized.length > 1) {
    normalized = normalized.slice(1);
  }

  if (normalized[0] === "--") {
    normalized = normalized.slice(1);
  }

  return normalized;
}

function defaultBus(): CommandBus {
  return createCommandBus();
}

export function runCli(args: readonly string[], bus: CommandBus = defaultBus()): CliResult {
  const normalizedArgs = normalizeArgs(args);

  if (normalizedArgs[0] === "ipc") {
    runIpcCommand(bus, normalizedArgs.slice(1));
    return { mode: "ipc" };
  }

  const shell = startShell({ dryRun: false });
  return { mode: "start", modules: shell.modules };
}

export async function runCliProcess(
  args: readonly string[]
): Promise<CliResult> {
  const normalizedArgs = normalizeArgs(args);

  if (normalizedArgs[0] === "ipc") {
    const tokens = normalizedArgs.slice(1);
    const definition = lookupIpcCommand(tokens);

    if (!definition) {
      throw new Error(`Unknown IPC command: ${tokens.join(" ")}`);
    }

    await sendCommandToRuntime(definition.command);
    return { mode: "ipc" };
  }

  const result = runCli(normalizedArgs);

  if (result.mode !== "start") {
    return result;
  }

  const uiHandle = await startUiServer();
  console.log(`amber-shell UI available at ${uiHandle.baseUrl}`);

  await new Promise<void>((resolve, reject) => {
    const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
    const signalHandlers = new Map<NodeJS.Signals, () => void>();
    let handled = false;

    const cleanup = () => {
      for (const signal of signals) {
        const handler = signalHandlers.get(signal);
        if (handler) {
          process.off(signal, handler);
        }
      }
    };

    const stop = async () => {
      if (handled) {
        return;
      }
      handled = true;
      try {
        await uiHandle.stop();
        cleanup();
        resolve();
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    for (const signal of signals) {
      const handler = () => {
        void stop();
      };
      signalHandlers.set(signal, handler);
      process.on(signal, handler);
    }
  });

  return result;
}

function isMain(): boolean {
  return import.meta.url === `file://${process.argv[1]}`;
}

if (isMain()) {
  void runCliProcess(process.argv.slice(2)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
