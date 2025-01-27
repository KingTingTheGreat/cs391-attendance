"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import { UserProps, Role, AttendanceProps } from "@/types";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import exchangeGoogleCode from "./google/exchangeCode";
import getGoogleUser from "./google/getUserData";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { DEFAULT_ROLE, ENABLE_SIGN_ON, ENV, MOCK } from "./env";

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
        role: ["jting@bu.edu", "tdavoodi@bu.edu"].includes(googleUser.email)
          ? Role.admin
          : Role.student,
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
  cookieStore: ReadonlyRequestCookies | RequestCookies,
): Promise<UserProps | null> {
  if (ENV === "dev" && MOCK && !ENABLE_SIGN_ON) {
    const role = DEFAULT_ROLE || Role.student;
    const name = "dev-" + role;
    return {
      name,
      email: name + "@bu.edu",
      picture:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Boston_University_Terriers_logo.svg/150px-Boston_University_Terriers_logo.svg.png",
      role,
      attendanceList: [],
    };
  }

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

export async function clearUserCookie(
  response: NextResponse,
  cookieStore: ReadonlyRequestCookies | RequestCookies,
) {
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (sessionId) {
    // find user
    const usersCollection = await getCollection(USERS_COLLECTION);
    await usersCollection.updateOne(
      { sessionIdList: { $elemMatch: { $eq: sessionId } } },
      {
        // @ts-expect-error weird mongo linting?
        $pull: {
          sessionIdList: {
            $eq: sessionId,
          },
        },
      },
    );
  }

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
  });

  return true;
}
