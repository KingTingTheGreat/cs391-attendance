"use server";
import { cookies } from "next/headers";
import { userFromCookies } from "./cookies";

function currentESTTime(): string {
  const date = new Date();
  const datestring = date
    .toLocaleString("en-us", {
      timeZone: "America/New_York",
    })
    .replaceAll("/", "-")
    .replaceAll(":", "-")
    .replaceAll(", ", "_");
  const parts = datestring.split(" ");
  return parts[0].slice(0, -3) + parts[1];
}

export default async function markAsPresent(): Promise<boolean> {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user) {
    return false;
  }

  const t = currentESTTime();
  console.log(t);

  return true;
}
