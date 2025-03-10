import { DayEnum } from "@/types";

export function formatDate(date: Date): string {
  return date
    .toLocaleString("en-us", {
      timeZone: "America/New_York",
    })
    .split(", ")[0];
}

export function formatTime(date: Date): string {
  const timeParts = date
    .toLocaleString("en-us", { timeZone: "America/New_York" })
    .split(", ")[1]
    .split(":");
  return timeParts[0] + ":" + timeParts[1] + timeParts[2].slice(2);
}

export function formatDay(date: Date): DayEnum {
  return date
    .toLocaleString("en-us", {
      weekday: "long",
      timeZone: "America/New_York",
    })
    .toLowerCase() as DayEnum;
}

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
