import {
  createClockModuleModel,
  type ClockModuleModel
} from "./modules/Clock.js";
import {
  createStatusModuleModel,
  type StatusModuleModel
} from "./modules/Status.js";
import {
  createWorkspacesModuleModel,
  type WorkspacesModuleModel
} from "./modules/Workspaces.js";

export interface BarSectionsModel {
  workspaces: WorkspacesModuleModel;
  clock: ClockModuleModel;
  status: StatusModuleModel;
}

export interface BarLayoutModel {
  position: "top";
  sections: BarSectionsModel;
  metadata: {
    autoHidden: boolean;
    sticky: true;
  };
}

export interface BarVisibilityOptions {
  isFullscreen: boolean;
  pinned?: boolean;
}

export function shouldShowBar(options: BarVisibilityOptions): boolean {
  if (options.isFullscreen && !options.pinned) {
    return false;
  }
  return true;
}

export function createBarLayoutModel(
  visibility: BarVisibilityOptions = { isFullscreen: false }
): BarLayoutModel {
  const sections: BarSectionsModel = {
    workspaces: createWorkspacesModuleModel(),
    clock: createClockModuleModel(),
    status: createStatusModuleModel()
  };

  return {
    position: "top",
    sections,
    metadata: {
      autoHidden: !shouldShowBar(visibility),
      sticky: true
    }
  };
}
