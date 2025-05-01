import { cookies } from "next/headers";
import Link from "next/link";
import SignInPage from "@/components/SignInPage";
import StudentProfile from "@/components/student/StudentProfile";
import Header from "@/components/Header";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { StudentContextProvider } from "@/components/student/StudentContext";
import getAttendanceDates from "@/lib/util/getAttendanceDates";
import { AttendanceDates } from "@/types";
import markAsPresent from "@/lib/student/markAsPresent";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message: string; code: string }>;
}) {
  const cookieStore = await cookies();
  const qParams = await searchParams;
  let user = await userFromAuthCookie(cookieStore, true);
  if (!user) {
    return <SignInPage errorMessage={qParams.message} />;
  }

  if (qParams.code) {
    const res = await markAsPresent(qParams.code);
    if (res.errorMessage === null || res.errorMessage === undefined) {
      user = {
        ...user,
        attendanceList: addToAttendanceList(user.attendanceList, res.newAtt),
      };
    }
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
