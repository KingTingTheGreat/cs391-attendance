import AdminPanel from "@/components/control/AdminPanel";
import Header from "@/components/Header";
import {
  PREV_ATTENDANCE_SORT_COOKIE,
  PREV_CLASS_TYPE_COOKIE,
} from "@/lib/cookies/cookies";
import { userFromAuthCookie } from "@/lib/cookies/userFromAuthCookie";
import { Class, Role } from "@/types";
import { GridSortModel } from "@mui/x-data-grid";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const allowedRoles = [Role.staff, Role.admin];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const user = await userFromAuthCookie(cookieStore);

  if (!user || !allowedRoles.includes(user.role)) {
    // only allow staff and admin to see this page
    return redirect("/");
  }

  const prevClassType = cookieStore.get(PREV_CLASS_TYPE_COOKIE)?.value as Class;
  const prevSortModel = JSON.parse(
    cookieStore.get(PREV_ATTENDANCE_SORT_COOKIE)?.value || "[]",
  ) as GridSortModel;

  console.log("admin panel viewed by", user.name, user.email);

  // use default role in dev environment
  return (
    <>
      <Header role={user.role} />
      <div className="px-8 py-2 w-full">
        <h1 className="text-4xl font-bold text-center">Admin Page</h1>
        <AdminPanel
          role={user.role}
          prevClassType={prevClassType}
          prevSortModel={prevSortModel}
        />
      </div>
    </>
  );
}
