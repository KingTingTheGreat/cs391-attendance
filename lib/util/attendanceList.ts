import { AttendanceStatus, Role, UserProps } from "@/types";
import { formatDate, formatTime } from "./format";

// number of headers that are not dates
export const NumLong = 2;

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
          const t = formatTime(user.attendanceList[i].date);
          i++;
          return t;
        } else {
          return AttendanceStatus.absent;
        }
      }),
    ];
  });

  return [["Name", "Email", ...dates], ...rows];
}
