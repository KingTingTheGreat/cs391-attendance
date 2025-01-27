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
