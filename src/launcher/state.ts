export type DesktopApp = {
  id: string;
  name: string;
};

export interface LauncherState {
  apps: DesktopApp[];
  lastUsedAtById: Record<string, number>;
}

export function createLauncherState(apps: DesktopApp[] = []): LauncherState {
  return {
    apps: [...apps],
    lastUsedAtById: {}
  };
}

export function recordAppLaunch(
  state: LauncherState,
  appId: string,
  timestamp = Date.now()
): LauncherState {
  return {
    ...state,
    lastUsedAtById: {
      ...state.lastUsedAtById,
      [appId]: timestamp
    }
  };
}

export function getLastUsedAt(
  state: LauncherState,
  app: DesktopApp
): number | undefined {
  return state.lastUsedAtById[app.id];
}

export interface LauncherController {
  readonly isVisible: boolean;
  show(): void;
  hide(): void;
  toggle(): void;
}

export function createLauncherController(
  initialVisibility = false
): LauncherController {
  let visible = initialVisibility;

  return {
    get isVisible() {
      return visible;
    },
    show() {
      visible = true;
    },
    hide() {
      visible = false;
    },
    toggle() {
      visible = !visible;
    }
  };
}
