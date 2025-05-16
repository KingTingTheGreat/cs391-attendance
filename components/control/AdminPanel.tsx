import { Role } from "@/types";
import DeleteAllStudents from "./DeleteAllStudents";
import { UsersContextProvider } from "./UsersContext";
import MarkStudentAttendance from "./MarkStudentAttendance";
import AttendanceSheet from "../attendance/AttendanceSheet";
import { getAllUsers } from "@/lib/util/getAllUsers";
import createInitialAttList from "@/lib/util/createInitialAttList";
import EditDeleteUser from "./EditDeleteUser";

export default async function AdminPanel({ role }: { role: Role }) {
  const users = await getAllUsers();
  const initialAttList = await createInitialAttList(users);

  return (
    <UsersContextProvider usersInput={users} initialAttList={initialAttList}>
      <div className="flex flex-col items-center sm:flex-row justify-center sm:items-start">
        {role === Role.admin && (
          <>
            <EditDeleteUser />
          </>
        )}
        <MarkStudentAttendance />
      </div>

      <div className="flex flex-col items-center px-8 pb-8 pt-2">
        <AttendanceSheet />
      </div>
      {role === Role.admin && (
        <div className="flex justify-center">
          <DeleteAllStudents />
        </div>
      )}
    </UsersContextProvider>
  );
}
