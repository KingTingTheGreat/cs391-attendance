"use server";
import getCollection, { USERS_COLLECTION } from "@/db";
import documentToUserProps from "../util/documentToUserProps";
import { verifyPassword } from "./pwFuncs";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "../cookies/cookies";
import { createJwt } from "../jwt";
import { ENABLE_PASSWORD, ENV } from "../env";

const errorMessage = "email and password do not match";

export default async function signInWithPassword(
  email: string,
  password: string,
): Promise<string | null> {
  if (!email || !password) {
    return "email and password are both required";
  }

  if (!ENABLE_PASSWORD) {
    return errorMessage;
  }

  const usersCollection = await getCollection(USERS_COLLECTION);
  const data = await usersCollection.findOne({ email });
  if (!data) {
    return errorMessage;
  }

  const user = documentToUserProps(data, true);
  if (!user.pwInfo) {
    return errorMessage;
  }

  const success = await verifyPassword(password, user.pwInfo);
  if (!success) {
    return errorMessage;
  }

  const cookieStore = await cookies();
  cookieStore.set(
    AUTH_COOKIE,
    createJwt({ name: user.name, email: user.email }),
    {
      httpOnly: true,
      secure: ENV === "prod",
      path: "/",
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
    },
  );

  return null;
}
