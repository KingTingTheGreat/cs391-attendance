import { Class, Role } from "@/types";
import EditRole from "./EditRole";
import DeleteAllStudents from "./DeleteAllStudents";
import DeleteUser from "./DeleteUser";
import { UsersContextProvider } from "./UsersContext";
import MarkStudentAttendance from "./MarkStudentAttendance";
import AttendanceSheet from "../attendance/AttendanceSheet";
import { getAllUsers } from "@/lib/util/getAllUsers";
import { GridSortModel } from "@mui/x-data-grid";
import createInitialAttList from "@/lib/util/createInitialAttList";
import { headers } from "@/lib/util/getAttendanceList";
import { setDateCache } from "@/lib/cache/redis";

export default async function AdminPanel({
  role,
  prevClassType,
  prevSortModel,
}: {
  role: Role;
  prevClassType?: Class;
  prevSortModel?: GridSortModel;
}) {
  const users = await getAllUsers();
  const initialAttList = createInitialAttList(users);

  // update cache
  try {
    for (const clsType in initialAttList) {
      const dates = initialAttList[clsType][0].slice(headers.length);
      // the dates fields of attendance list are all strings
      await setDateCache(clsType as Class, ...(dates as string[]));
    }
  } catch (e) {
    console.error("something went wrong when updating cache", e);
  }

  return (
    <UsersContextProvider usersInput={users} initialAttList={initialAttList}>
      <div className="flex flex-col items-center sm:flex-row justify-center sm:items-start">
        {role === Role.admin && (
          <>
            <EditRole />
            <DeleteUser />
          </>
        )}
        <MarkStudentAttendance />
      </div>

      <div className="flex flex-col items-center p-8">
        <AttendanceSheet
          prevClassType={prevClassType}
          prevSortModel={prevSortModel}
        />
      </div>
      {role === Role.admin && (
        <div className="flex justify-center">
          <DeleteAllStudents />
        </div>
      )}
    </UsersContextProvider>
  );
}
