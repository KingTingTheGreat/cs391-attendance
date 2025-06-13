import { cookies } from "next/headers";
import Link from "next/link";
import StudentProfile from "@/components/student/StudentProfile";
import Header from "@/components/Header";
import { StudentContextProvider } from "@/components/student/StudentContext";
import markAsPresent from "@/lib/student/markAsPresent";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { dbDataFromAuthCookie } from "@/lib/cookies/dbDataFromAuthCookie";
import { formatDate } from "@/lib/util/format";
import ChooseSignIn from "@/components/ChooseSignIn";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ message: string; code: string }>;
}) {
  const cookieStore = await cookies();
  const qParams = await searchParams;
  const dbData = await dbDataFromAuthCookie(cookieStore, true);
  if (!dbData) {
    return <ChooseSignIn errorMessage={qParams.message} />;
  }

  const attendanceDates = dbData.attendanceDates;
  let user = dbData.user;
  if (!user) {
    return <ChooseSignIn errorMessage={qParams.message} />;
  }

  // don't send pw info to frontend
  user.pwInfo = undefined;

  if (qParams.code) {
    const res = await markAsPresent(qParams.code, true);
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
          <Link href="/password" className="hover:underline py-2">
            Create/Edit Password
          </Link>
          <Link
            href="/sign-out"
            prefetch={false}
            className="hover:underline py-2"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </StudentContextProvider>
  );
}
