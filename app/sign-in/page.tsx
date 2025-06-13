import Header from "@/components/Header";
import PasswordSignInForm from "@/components/password/PasswordSignInForm";
import { jwtDataFromAuthCookie } from "@/lib/cookies/jwtDataFromAuthCookie";
import { ENABLE_PASSWORD } from "@/lib/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const cookieStore = await cookies();
  const claims = await jwtDataFromAuthCookie(cookieStore);
  if (claims || !ENABLE_PASSWORD) {
    return redirect("/");
  }

  return (
    <>
      <Header />
      <PasswordSignInForm />
    </>
  );
}
