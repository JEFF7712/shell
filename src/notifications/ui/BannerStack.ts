import "../../styles/notifications.css";
import type { Notification } from "../model.js";

const stack: Notification[] = [];

export interface BannerStackModel {
  getEntries(): Notification[];
  setEntries(next: Notification[]): void;
}

export const bannerStackModel: BannerStackModel = {
  getEntries: () => stack.slice(),
  setEntries: (next) => {
    stack.splice(0, stack.length, ...next);
  },
};

export function BannerStack(): null {
  return null;
}
