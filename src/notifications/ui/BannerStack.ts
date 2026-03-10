import "../../styles/notifications.css";
import type {
  Notification,
  NotificationController,
} from "../model.js";

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

export interface BannerStackProps {
  controller: NotificationController;
}

export function BannerStack({ controller }: BannerStackProps): null {
  void controller;
  return null;
}
