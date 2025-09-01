import { AttendanceDates, Class, Role, UserProps } from "@/types";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { jwtDataFromAuthCookie } from "./jwtDataFromAuthCookie";
import getCollection, { USERS_COLLECTION } from "@/db";
import documentToUserProps from "../util/documentToUserProps";

function dbArrayToAttendanceDates(
  data: { dates: string[]; class: Class }[],
): AttendanceDates {
  const attendanceDates: AttendanceDates = {};

  for (const item of data) {
    if (!attendanceDates[item.class]) {
      attendanceDates[item.class] = new Set(item.dates);
    }
  }

  return attendanceDates;
}

export async function dbDataFromAuthCookie(
  cookieStore: ReadonlyRequestCookies | RequestCookies,
  includeAttendanceDates?: boolean,
): Promise<{ user: UserProps; attendanceDates?: AttendanceDates } | null> {
  const claims = await jwtDataFromAuthCookie(cookieStore);
  if (!claims) {
    return null;
  }

  const usersCollection = await getCollection(USERS_COLLECTION);

  if (!includeAttendanceDates) {
    const data = await usersCollection.findOne({ email: claims.email });
    if (!data) {
      return null;
    }

    return { user: documentToUserProps(data) };
  }

  const cursor = usersCollection.aggregate([
    {
      $facet: {
        user: [{ $match: { email: claims.email } }, { $limit: 1 }],
        attendanceDates: [
          { $match: { role: Role.student } },
          { $unwind: "$attendanceList" },
          {
            $project: {
              class: "$attendanceList.class",
              parts: {
                $dateToParts: {
                  date: "$attendanceList.date",
                  timezone: "America/New_York",
                },
              },
            },
          },
          {
            $project: {
              class: 1,
              formattedDate: {
                $concat: [
                  { $toString: "$parts.month" },
                  "/",
                  { $toString: "$parts.day" },
                  "/",
                  { $toString: "$parts.year" },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$class",
              dates: { $addToSet: "$formattedDate" },
            },
          },
          { $project: { class: "$_id", dates: 1, _id: 0 } },
        ],
      },
    },
    {
      $project: {
        user: { $arrayElemAt: ["$user", 0] },
        attendanceDates: 1,
      },
    },
  ]);

  if (!cursor) {
    return null;
  }
  const dataArray = await cursor.toArray();
  if (!dataArray || dataArray.length !== 1) {
    return null;
  }

  const data = dataArray[0];

  if (!data.user) {
    return null;
  }

  console.log("aggregate data", data);
  const res = {
    user: documentToUserProps(data.user),
    attendanceDates: dbArrayToAttendanceDates(data.attendanceDates),
  };
  console.log("aggregate res", res);
  return {
    user: documentToUserProps(data.user),
    attendanceDates: dbArrayToAttendanceDates(data.attendanceDates),
  };
}
