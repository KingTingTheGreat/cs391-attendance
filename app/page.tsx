import googleSignInLink from "@/lib/googleSignInLink";
import { userFromCookies } from "@/lib/cookies";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import PresentButton from "@/components/present-button";

export default async function Home() {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user) {
    return (
      <div>
        <h1 className="text-4xl font-bold">CS391 Attendance</h1>
        <p>You are not signed in</p>
        <Link href={googleSignInLink()}>Sign In with Google</Link>
      </div>
    );
  }

  const presentToday =
    user.attendanceList &&
    user.attendanceList.length > 0 &&
    user.attendanceList[user.attendanceList.length - 1].date == new Date();

  return (
    <div>
      <h1 className="text-4xl font-bold">CS391 Attendance</h1>
      <p>You are signed in</p>
      <p>Hi {user.name}!</p>
      {presentToday ? (
        <p>You have been marked as present today</p>
      ) : (
        <PresentButton />
      )}
      <Image
        src={user.picture}
        alt="profile picture"
        width={100}
        height={100}
        className="rounded-full"
      />
    </div>
  );
}
