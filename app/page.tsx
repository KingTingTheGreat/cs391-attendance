"use server";
import { userFromCookies } from "@/lib/cookies";
import { cookies } from "next/headers";
import Link from "next/link";
import SignIn from "@/components/sign-in";
import StudentProfile from "@/components/student/student-profile";

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
    <div className="flex justify-center">
      <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
        <StudentProfile user={user} />
        <Link href="/sign-out" prefetch={false} className="hover:underline">
          Sign Out
        </Link>
      </div>
    </div>
  );
}
