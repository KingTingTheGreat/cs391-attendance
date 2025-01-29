"use server";
import { NextResponse } from "next/server";
import exchangeGoogleCode from "../google/exchangeCode";
import getGoogleUser from "../google/getUserData";
import getCollection, { USERS_COLLECTION } from "@/db";
import { Role } from "@/types";
import { createJwt } from "../jwt";
import { COOKIE_NAME } from "./cookies";
import { ENV } from "../env";

export async function setUserCookie(
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
  const res = await usersCollection.updateOne(
    { email: googleUser.email },
    {
      $set: {
        name: googleUser.name,
        picture: googleUser.picture,
      },
      $setOnInsert: {
        email: googleUser.email,
        role: ["jting@bu.edu", "tdavoodi@bu.edu"].includes(googleUser.email)
          ? Role.admin
          : Role.student,
        attendanceList: [],
      },
    },
    {
      upsert: true,
    },
  );

  if (!res.acknowledged) {
    console.error("failed to update/insert user in database");
    return false;
  }

  response.cookies.set(
    COOKIE_NAME,
    createJwt({
      name: googleUser.name,
      email: googleUser.email,
    }),
    {
      httpOnly: true,
      secure: ENV === "prod",
      path: "/",
    },
  );

  return true;
}
