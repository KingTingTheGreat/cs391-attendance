"use server";
import { userFromCookies } from "@/lib/cookies";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import PresentButton from "@/components/student/present-button";
import SignIn from "@/components/sign-in";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user) {
    const qParams = await searchParams;
    return <SignIn errorMessage={qParams.message} />;
  }

  return (
    <div>
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
