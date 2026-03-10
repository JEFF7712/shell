export interface ShellConfigSchema {
  modules: string[];
}

export const defaultShellConfig: ShellConfigSchema = {
  modules: [],
};
