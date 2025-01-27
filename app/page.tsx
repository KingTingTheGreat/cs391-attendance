"use server";
import googleSignInLink from "@/lib/google/googleSignInLink";
import { userFromCookies } from "@/lib/cookies";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import PresentButton from "@/components/student/present-button";

export default async function Home() {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user) {
    return (
      <div>
        <p>You are not signed in</p>
        <Link href={googleSignInLink()}>Sign In with Google</Link>
      </div>
    );
  }

  return (
    <div>
      <p>You are signed in</p>
      <p>Hi {user.name}!</p>
      <PresentButton user={user} />
      <Image
        src={user.picture}
        alt="profile picture"
        width={100}
        height={100}
        className="rounded-full"
      />
      <Link href="/sign-out" prefetch={false}>
        Sign Out
      </Link>
    </div>
  );
}
