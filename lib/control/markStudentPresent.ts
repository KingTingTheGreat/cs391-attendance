"use server";
import { AttendanceProps, Class, MarkResult, Role } from "@/types";
import { cookies } from "next/headers";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import { formatDate } from "../util/format";
import { ENV, MOCK } from "../env";
import documentToUserProps from "../util/documentToUserProps";
import { addToAttendanceList } from "../util/addToAttendanceList";
import { dbDataFromAuthCookie } from "../cookies/dbDataFromAuthCookie";

const allowedRoles = [Role.staff, Role.admin];

export async function markStudentPresent(
  email: string,
  date: Date,
  classType: Class,
): Promise<MarkResult> {
  if (isNaN(date.getTime())) {
    return { message: "invalid date" };
  }

  const cookieStore = await cookies();
  const dbData = await dbDataFromAuthCookie(cookieStore, false, true);

  if (!dbData || !allowedRoles.includes(dbData.user.role)) {
    return { message: "unauthorized. please sign in again." };
  }

  // no way to get user data when MOCK, will show as error in the frontend
  if (ENV === "dev" && MOCK) {
    return {
      message: `successfully marked ${email} as absent on ${formatDate(date)}`,
    };
  }

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email });
    if (!data) throw new Error(`user with email ${email} was not found`);

    const attendanceList = data.attendanceList as AttendanceProps[];
    addToAttendanceList(attendanceList, {
      class: classType,
      date,
      performedBy: dbData.user.email,
      permittedBy: dbData.user.email,
    });

    // const usersCollection = await getCollection(USERS_COLLECTION);
    data = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          attendanceList,
        },
      },
      {
        returnDocument: "after",
      },
    );
    if (!data) {
      throw new Error(
        `could not mark ${email} as present. please try again later`,
      );
    }
    const updatedUser = documentToUserProps(data);

    session.commitTransaction();
    console.log("SUCCESSFULLY MARKED PRESENT");

    return {
      user: updatedUser,
      message: `successfully marked ${email} as present in ${classType} on ${formatDate(date)}`,
    };
  } catch (error) {
    await session.abortTransaction();
    let message = "something went wrong. please try again later.";
    if (error instanceof Error) {
      console.error("error message:", error.message);
      message = error.message;
    }
    return { message };
  } finally {
    await session.endSession();
  }
}
