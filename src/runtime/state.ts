import type { ShellCommand } from "../core/commands.js";
import type { Notification } from "../notifications/model.js";

export interface RuntimeState {
  launcherVisible: boolean;
  notifications: Notification[];
  barVisible: boolean;
}

export interface RuntimeStateInit {
  launcherVisible?: boolean;
  notifications?: Notification[];
  barVisible?: boolean;
}

export function createRuntimeState(init: RuntimeStateInit = {}): RuntimeState {
  return {
    launcherVisible: init.launcherVisible ?? false,
    notifications: [...(init.notifications ?? [])],
    barVisible: init.barVisible ?? true,
  };
}

export function reduceRuntimeState(state: RuntimeState, command: ShellCommand): RuntimeState {
  if (command.type === "launcher.toggle") {
    return {
      ...state,
      launcherVisible: !state.launcherVisible,
    };
  }

  if (command.type === "notifications.dismissAll") {
    return {
      ...state,
      notifications: [],
    };
  }

  if (command.type === "bar.setVisibility") {
    return {
      ...state,
      barVisible: command.payload.visible,
    };
  }

  return state;
}
