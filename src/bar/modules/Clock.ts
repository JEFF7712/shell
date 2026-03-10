export interface ClockModuleModel {
  timeLabel: string;
  dateHint: string;
}

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function padMinutes(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatTimeLabel(date: Date): string {
  const hours = date.getHours();
  const minutes = padMinutes(date.getMinutes());
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

function formatDateHint(date: Date): string {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  return `${weekday}, ${month} ${day}`;
}

export function createClockModuleModel(referenceDate = new Date()): ClockModuleModel {
  return {
    timeLabel: formatTimeLabel(referenceDate),
    dateHint: formatDateHint(referenceDate)
  };
}
