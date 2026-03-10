export interface WorkspaceSlot {
  id: string;
  name: string;
  isActive: boolean;
  description: string;
}

export interface WorkspacesModuleModel {
  slots: WorkspaceSlot[];
  ariaLabel: string;
}

const WORKSPACE_NAMES = ["Creative", "Terminal", "Browser", "Docs", "Chat"];

export function createWorkspacesModuleModel(activeId?: string): WorkspacesModuleModel {
  const slots: WorkspaceSlot[] = WORKSPACE_NAMES.map((label, index) => {
    const id = `workspace-${index + 1}`;
    return {
      id,
      name: label,
      description: `${label} workspace`,
      isActive: activeId ? activeId === id : index === 0
    };
  });

  return {
    slots,
    ariaLabel: "Workspace switcher"
  };
}
