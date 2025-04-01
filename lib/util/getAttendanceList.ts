import { AttendanceStatus, Class, Role, UserProps } from "@/types";
import { formatDate, formatTime } from "./format";
import formatPercentage from "./formatPercentage";

// number of headers that are not dates
export const headers = ["Name", "Email", "Total", "%"];

export function getAttendanceList(
  users: UserProps[],
  classType: Class,
): (string | number)[][] {
  // filter for students only
  users = users.filter((user) => user.role === Role.student);

  const uniqueDates: { [key: string]: Date } = {};
  for (const user of users) {
    for (const att of user.attendanceList) {
      if (classType && att.class !== classType) {
        continue;
      }
      uniqueDates[formatDate(att.date)] = att.date;
    }
  }
  const dates = Object.keys(uniqueDates);
  dates.sort((a, b) => uniqueDates[a].getTime() - uniqueDates[b].getTime());

  const rows = users.map((user) => {
    const numPresent = user.attendanceList.reduce(
      (acc, cur) => (cur.class === classType ? acc + 1 : acc),
      0,
    );
    let i = 0;
    return [
      user.name,
      user.email,
      numPresent,
      formatPercentage(numPresent, dates.length),
      ...dates.map((d) => {
        while (
          i < user.attendanceList.length &&
          user.attendanceList[i].class !== classType
        ) {
          i++;
        }
        if (i >= user.attendanceList.length) return AttendanceStatus.absent;
        if (formatDate(user.attendanceList[i].date) === d) {
          i++;
          return formatTime(user.attendanceList[i - 1].date);
        } else {
          return AttendanceStatus.absent;
        }
      }),
    ];
  });

  return [[...headers, ...dates], ...rows];
}
