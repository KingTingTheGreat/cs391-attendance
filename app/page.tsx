import { cookies } from "next/headers";
import Link from "next/link";
import SignInPage from "@/components/sign-in-page";
import StudentProfile from "@/components/student/student-profile";
import Header from "@/components/header";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { Suspense } from "react";
import { Role } from "@/types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore, true);
  if (!user) {
    const qParams = await searchParams;
    return <SignInPage errorMessage={qParams.message} />;
  }

  return (
    <>
      <Suspense fallback={<Header role={Role.student} />}>
        <Header role={user.role} />
        <div className="flex justify-center">
          <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
            <StudentProfile userInput={user} />
            <Link href="/sign-out" prefetch={false} className="hover:underline">
              Sign Out
            </Link>
          </div>
        </div>
      </Suspense>
    </>
  );
}
