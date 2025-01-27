import googleSignInLink from "@/lib/google/googleSignInLink";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const qParams = await searchParams;
  const msg = qParams.message;

  if (!msg) return redirect("/");

  return (
    <div>
      <p>{msg}</p>
      <Link href={googleSignInLink()}>Sign In with Google</Link>
    </div>
  );
}
