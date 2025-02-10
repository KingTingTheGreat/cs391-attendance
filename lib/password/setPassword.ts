"use server";
import { ServerFuncRes } from "@/types";
import { cookies } from "next/headers";
import { userFromAuthCookie } from "../cookies/userFromAuthCookie";
import { hashPassword, newSalt, verifyPassword } from "./pwFuncs";
import { startCollectionSession, USERS_COLLECTION } from "@/db";
import documentToUserProps from "../util/documentToUserProps";
import { setUserInCache } from "../cache/redis";
import { ENV, MOCK } from "../env";

export async function setPassword(
  curPw: string,
  newPw1: string,
  newPw2: string,
): Promise<ServerFuncRes> {
  if (newPw1 !== newPw2) {
    return {
      success: false,
      message: "new passwords do not match",
    };
  } else if (newPw1.length < 7) {
    return {
      success: false,
      message: "password must be at least 7 characters long",
    };
  }

  const cookieStore = await cookies();
  // use cache to get basic user info, will go to DB for pw info
  const user = await userFromAuthCookie(cookieStore, true);
  if (!user) {
    return {
      success: false,
      message: "something went wrong. please sign in again.",
    };
  }

  if (ENV === "dev" && MOCK) {
    return {
      success: true,
      message: "successfully set new password",
    };
  }

  const { session, collection: usersCollection } =
    await startCollectionSession(USERS_COLLECTION);

  try {
    session.startTransaction();

    let data = await usersCollection.findOne({ email: user.email });
    if (!data) throw new Error("something weng wrong. please sign in again");

    // if password has been set, verify curPw
    if (data.pwInfo && !(await verifyPassword(curPw, data.pwInfo))) {
      throw new Error("incorrect password");
    }

    const salt = newSalt();
    data = await usersCollection.findOneAndUpdate(
      { email: data.email },
      {
        $set: {
          pwInfo: {
            pwHash: await hashPassword(newPw1, salt),
            salt: salt,
          },
        },
      },
      {
        returnDocument: "after",
      },
    );
    if (!data) {
      console.error("failed to update/insert user in database");
      throw new Error("something weng wrong. please try again.");
    }

    await session.commitTransaction();

    console.log("successfully set user password");
    setUserInCache(documentToUserProps(data));

    return {
      success: true,
      message: "successfully set new password",
    };
  } catch (error) {
    console.log("CAUGHT ERROR");
    let message = "something went wrong. please try again.";
    if (error instanceof Error) {
      message = error.message;
    }
    await session.abortTransaction();
    return {
      success: false,
      message,
    };
  } finally {
    await session.endSession();
  }
}
