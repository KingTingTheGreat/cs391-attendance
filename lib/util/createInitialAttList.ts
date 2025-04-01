import { AttendanceList, Class, UserProps } from "@/types";
import { getAttendanceList, headers } from "./getAttendanceList";
import { setDateCache } from "../cache/redis";

export default async function createInitialAttList(
  users: UserProps[],
): Promise<AttendanceList> {
  const attendanceList: AttendanceList = {};
  for (const clsType in Class) {
    attendanceList[clsType] = getAttendanceList(users, clsType as Class);
  }

  // update cache
  try {
    for (const clsType in attendanceList) {
      const dates = attendanceList[clsType][0].slice(headers.length);
      // the dates fields of attendance list are all strings
      await setDateCache(clsType as Class, ...(dates as string[]));
    }
  } catch (e) {
    console.error("something went wrong when updating cache", e);
  }

  return attendanceList;
}
