import { AttendanceList, Class, UserProps } from "@/types";
import { getAttendanceList } from "./getAttendanceList";

export default function createInitialAttList(
  users: UserProps[],
): AttendanceList {
  const attendanceList: AttendanceList = {};
  for (const clsType in Class) {
    attendanceList[clsType] = getAttendanceList(users, clsType as Class);
  }

  return attendanceList;
}
