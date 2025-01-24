"use server";
import { GoogleUserProps } from "@/types";

export default async function getGoogleUser(
  accessToken: string,
): Promise<GoogleUserProps | undefined> {
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (res.status !== 200) {
    return undefined;
  }

  const data = (await res.json()) as GoogleUserProps;
  console.log("google user data", data);

  return data;
}
