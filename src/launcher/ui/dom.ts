export interface LauncherDomElement {
  className: string;
  textContent: string | null;
  append(...children: Array<LauncherDomElement | string>): void;
  addEventListener(
    type: string,
    listener: (event: unknown) => void
  ): void;
  setAttribute(name: string, value: string): void;
  type?: string;
}

export interface LauncherDocument {
  createElement(tag: string): LauncherDomElement;
}

declare const document: LauncherDocument;

export const dom: LauncherDocument = document;
