import { AttendanceDates, Class } from "@/types";
import { getDatesFromCache } from "../cache/redis";

export default async function getAttendanceDates(): Promise<AttendanceDates> {
  const attendanceDates: AttendanceDates = {};
  for (const clsType in Class) {
    attendanceDates[clsType as string] = await getDatesFromCache(
      clsType as Class,
    );
  }

  return attendanceDates;
}
