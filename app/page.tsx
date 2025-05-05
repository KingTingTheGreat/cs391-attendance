import { cookies } from "next/headers";
import Link from "next/link";
import SignInPage from "@/components/SignInPage";
import StudentProfile from "@/components/student/StudentProfile";
import Header from "@/components/Header";
import { StudentContextProvider } from "@/components/student/StudentContext";
import markAsPresent from "@/lib/student/markAsPresent";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { dbDataFromAuthCookie } from "@/lib/cookies/dbDataFromAuthCookie";
import { formatDate } from "@/lib/util/format";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message: string; code: string }>;
}) {
  const cookieStore = await cookies();
  const qParams = await searchParams;
  const dbData = await dbDataFromAuthCookie(cookieStore, true);
  if (!dbData) {
    return <SignInPage errorMessage={qParams.message} />;
  }

  const attendanceDates = dbData.attendanceDates;
  let user = dbData.user;
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

      // check if newAtt needs to be appended to set
      if (attendanceDates) {
        attendanceDates[res.newAtt.class].add(formatDate(res.newAtt.date));
      }
    }
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
