"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { UserProps, Role, AttendanceProps } from "@/types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import exchangeGoogleCode from "./google/exchangeCode";
import getGoogleUser from "./google/getUserData";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

const COOKIE_NAME = "cs391-attendance-cookie";

function genSessionId(): string {
  const randomBuffer = randomBytes(64);
  return randomBuffer.toString("hex");
}

export async function setUserCookies(
  googleCode: string,
  response: NextResponse,
): Promise<boolean> {
  const accessToken = await exchangeGoogleCode(googleCode);
  const googleUser = await getGoogleUser(accessToken);
  if (!googleUser) {
    console.error("failed to get user information from google");
    return false;
  }

  const sessionId = genSessionId();

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
        role: Role.Student,
        attendanceList: [],
      },
      // @ts-expect-error weird mongo linting?
      $push: {
        sessionIdList: {
          $each: [sessionId],
          $slice: -5, // users can be signed in on 5 devices at a time (protects database storage)
        },
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

  response.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    path: "/",
  });

  return true;
}

export async function userFromCookies(
  cookieStore: ReadonlyRequestCookies,
): Promise<UserProps | null> {
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const usersCollection = await getCollection(USERS_COLLECTION);
  const data = await usersCollection.findOne({
    sessionIdList: { $elemMatch: { $eq: sessionId } },
  });

  if (!data) return null;

  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    role: data.role as Role,
    attendanceList: data.attendanceList as AttendanceProps[],
  };
}
