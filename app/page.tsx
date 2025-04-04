import { cookies } from "next/headers";
import Link from "next/link";
import SignInPage from "@/components/SignInPage";
import StudentProfile from "@/components/student/StudentProfile";
import Header from "@/components/Header";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { StudentContextProvider } from "@/components/student/StudentContext";
import getAttendanceDates from "@/lib/util/getAttendanceDates";
import { AttendanceDates } from "@/types";

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

  let attendanceDates: AttendanceDates | undefined = undefined;
  try {
    attendanceDates = await getAttendanceDates();
  } catch (e) {
    console.error("could not get attendance dates", e);
  }

  return (
    <StudentContextProvider inputUser={user} attendanceDates={attendanceDates}>
      <Header role={user.role} />
      <div className="flex justify-center">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <StudentProfile />
          <Link href="/sign-out" prefetch={false} className="hover:underline">
            Sign Out
          </Link>
        </div>
      </div>
    </StudentContextProvider>
  );
}
