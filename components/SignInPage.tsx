import googleSignInLink from "@/lib/google/googleSignInLink";
import Link from "next/link";
import Header from "./Header";

export default function SignInPage({
  errorMessage,
}: {
  errorMessage?: string;
}) {
  return (
    <>
      <Header />
      <div className="flex justify-center">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <p>Who are you? Please sign in so we can mark your attendance.</p>
          <Link
            href={googleSignInLink()}
            className="rounded-lg px-4 py-2 m-6 border-2 hover:bg-zinc-50"
          >
            Sign In With Google
          </Link>
          {errorMessage && (
            <p>
              ERROR: <span className="text-[#F00]">{errorMessage}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
