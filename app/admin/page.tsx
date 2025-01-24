import userFromCookies from "@/lib/userFromCookies";
import { Role } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const user = await userFromCookies(cookieStore);

  if (!user || user.role !== Role.Admin) {
    return redirect("/");
  }

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
}
