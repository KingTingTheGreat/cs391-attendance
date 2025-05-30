import { NextResponse } from "next/server";
import exchangeGoogleCode from "../google/exchangeCode";
import getGoogleUser from "../google/getUserData";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Role } from "@/types";
import { createJwt } from "../jwt";
import { AUTH_COOKIE } from "./cookies";
import { ENV } from "../env";

const adminEmails = ["jting@bu.edu", "tdavoodi@bu.edu"];

export async function setUserAuthCookie(
  googleCode: string,
  response: NextResponse,
): Promise<boolean> {
  const accessToken = await exchangeGoogleCode(googleCode);
  const googleUser = await getGoogleUser(accessToken);
  if (!googleUser) {
    console.error("failed to get user information from google");
    return false;
  }

  // find user
  const usersCollection = await getCollection(USERS_COLLECTION);
  const data = await usersCollection.findOneAndUpdate(
    { email: googleUser.email },
    {
      $set: {
        name: googleUser.name,
        picture: googleUser.picture,
      },
      $setOnInsert: {
        email: googleUser.email,
        role: adminEmails.includes(googleUser.email)
          ? Role.admin
          : Role.student,
        attendanceList: [],
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  if (!data) {
    console.error("failed to update/insert user in database");
    return false;
  }

  response.cookies.set(
    AUTH_COOKIE,
    createJwt({
      name: googleUser.name,
      email: googleUser.email,
    }),
    {
      httpOnly: true,
      secure: ENV === "prod",
      path: "/",
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
    },
  );

  return true;
}
