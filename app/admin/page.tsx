import AdminPanel from "@/components/admin-panel";
import { userFromCookies } from "@/lib/cookies";
import { Role, UserProps } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  let user: UserProps | null = null;
  if (process.env.ENVIRONMENT !== "dev") {
    const cookieStore = await cookies();
    user = await userFromCookies(cookieStore);

    if (!user) {
      return redirect("/");
    } else if (user.role !== Role.staff && user.role !== Role.admin) {
      // allow staff and admin to see this page
      redirect("/");
    }
  }

  // admin role in dev environment
  return (
    <div className="px-8 py-2 w-full">
      <h1 className="text-4xl font-bold text-center">Admin Page</h1>
      <AdminPanel role={user ? user.role : Role.admin} />
    </div>
  );
}
