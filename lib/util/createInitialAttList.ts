import { AttendanceList, Class, UserProps } from "@/types";
import { getAttendanceList } from "./getAttendanceList";

export default async function createInitialAttList(
  users: UserProps[],
): Promise<AttendanceList> {
  const attendanceList: AttendanceList = {};
  for (const clsType in Class) {
    attendanceList[clsType] = getAttendanceList(users, clsType as Class);
  }

  return attendanceList;
}
