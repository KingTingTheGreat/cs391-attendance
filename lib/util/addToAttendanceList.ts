import { AttendanceProps } from "@/types";
import { formatDate } from "./format";

export function addToAttendanceList(
  attendanceList: AttendanceProps[],
  newAtt: AttendanceProps,
): AttendanceProps[] {
  const formattedDate = formatDate(newAtt.date);
  const i = attendanceList.findIndex(
    (att) => formatDate(att.date) === formattedDate,
  );

  if (i !== -1) {
    attendanceList[i] = newAtt;
  } else {
    attendanceList.push(newAtt);
    attendanceList.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  return attendanceList;
}
