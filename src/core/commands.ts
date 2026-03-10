export type LauncherToggleCommand = {
  type: "launcher.toggle";
};

export type NotificationsDismissAllCommand = {
  type: "notifications.dismissAll";
};

export type BarSetVisibilityCommand = {
  type: "bar.setVisibility";
  payload: { visible: boolean };
};

export type ShellCommand =
  | LauncherToggleCommand
  | NotificationsDismissAllCommand
  | BarSetVisibilityCommand;

type CommandListener<K extends ShellCommand["type"]> = (
  command: Extract<ShellCommand, { type: K }>
) => void;

export interface CommandBus {
  on<K extends ShellCommand["type"]>(
    type: K,
    listener: CommandListener<K>
  ): () => void;
  dispatch(command: ShellCommand): void;
}

export function createCommandBus(): CommandBus {
  const listeners = new Map<
    ShellCommand["type"],
    Set<(command: ShellCommand) => void>
  >();

  return {
    on(type, listener) {
      const bucket = listeners.get(type) ?? new Set();
      bucket.add(listener as (command: ShellCommand) => void);
      listeners.set(type, bucket);

      return () => {
        bucket.delete(listener as (command: ShellCommand) => void);
      };
    },
    dispatch(command) {
      const bucket = listeners.get(command.type);
      if (!bucket) {
        return;
      }

      for (const listener of bucket) {
        listener(command);
      }
    }
  };
}
