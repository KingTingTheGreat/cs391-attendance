import { AttendanceStatus, Role, UserProps } from "@/types";

// number of headers that are not dates
export const NumLong = 2;

export function formatDate(date: Date): string {
  return date
    .toLocaleString("en-us", {
      timeZone: "America/New_York",
    })
    .split(", ")[0];
}

export function getAttendanceList(users: UserProps[]): string[][] {
  // filter for students only
  users = users.filter((user) => user.role === Role.student);

  const uniqueDates: { [key: string]: Date } = {};
  for (const user of users) {
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
        if (i >= user.attendanceList.length) return AttendanceStatus.absent;
        if (formatDate(user.attendanceList[i].date) === d) {
          i++;
          return AttendanceStatus.present;
        } else {
          return AttendanceStatus.absent;
        }
      }),
    ];
  });

  return [["Name", "Email", ...dates], ...rows];
}
