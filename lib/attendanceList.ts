import { Role, UserProps } from "@/types";

export function formatDate(date: Date): string {
  return date
    .toLocaleString("en-us", {
      timeZone: "America/New_York",
    })
    .split(", ")[0];
}

export function getAttendanceList(users: UserProps[]): string[][] {
  // filter for students and sort alphabetically
  users = users
    .filter((user) => user.role === Role.student)
    .sort((a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()));

  const uniqueDates: { [key: string]: Date } = {};
  for (const user of users) {
    if (!user.attendanceList) continue;
    for (const att of user.attendanceList) {
      uniqueDates[formatDate(att.date)] = att.date;
    }
  }
  const dates = Object.keys(uniqueDates);
  dates.sort((a, b) => uniqueDates[a].getTime() - uniqueDates[b].getTime());

  const rows = users.map((user) => {
    let i = 0;
    return [
      user.name,
      user.email,
      ...dates.map((d) => {
        if (!user.attendanceList) return "absent";
        if (i >= user.attendanceList.length) return "absent";
        if (formatDate(user.attendanceList[i].date) === d) {
          i++;
          return "present";
        } else {
          return "absent";
        }
      }),
    ];
  });

  return [["Name", "Email", ...dates], ...rows];
}
