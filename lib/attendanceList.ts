import { Role, UserProps } from "@/types";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

export function getAttendanceList(users: UserProps[]): string[][] {
  // filter for students and sort alphabetically
  users = users
    .filter((user) => user.role === Role.student)
    .sort((a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()));

  const uniqueDates = new Set<string>();
  for (const user of users) {
    if (!user.attendanceList) continue;
    for (const att of user.attendanceList) {
      uniqueDates.add(formatDate(att.date));
    }
  }
  const dates = Array.from(uniqueDates);
  dates.sort();

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

  console.log(rows);

  return [["Name", "Email", ...dates], ...rows];
}
