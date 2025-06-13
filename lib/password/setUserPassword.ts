"use server";
import { ServerFuncRes } from "@/types";
import { cookies } from "next/headers";
import { hashPassword, newSalt } from "./pwFuncs";
import getCollection, { USERS_COLLECTION } from "@/db";
import { ENABLE_PASSWORD, ENV, MOCK } from "../env";
import { jwtDataFromAuthCookie } from "../cookies/jwtDataFromAuthCookie";

const minPasswordLength = 8;

export async function setUserPassword(newPw: string): Promise<ServerFuncRes> {
  if (newPw.length < minPasswordLength) {
    return {
      success: false,
      message: `password must be at least ${minPasswordLength} characters long`,
    };
  }

  if (!ENABLE_PASSWORD) {
    return {
      success: false,
      message: "something went wrong. please sign in again.",
    };
  }

  const cookieStore = await cookies();
  const claims = await jwtDataFromAuthCookie(cookieStore);
  if (!claims) {
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

  const usersCollection = await getCollection(USERS_COLLECTION);

  const salt = newSalt();

  usersCollection.updateOne(
    { email: claims.email },
    {
      $set: {
        pwInfo: {
          pwHash: await hashPassword(newPw, salt),
          salt: salt,
        },
      },
    },
  );
  return {
    success: true,
    message: "successfully set new password",
  };
}
