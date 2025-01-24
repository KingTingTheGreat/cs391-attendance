import googleSignInLink from "@/lib/googleSignInLink";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">CS391 Attendance</h1>
      <Link href={googleSignInLink()}>Sign In with Google</Link>
    </div>
  );
}
