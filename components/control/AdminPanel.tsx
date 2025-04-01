import { Role } from "@/types";
import EditRole from "./EditRole";
import DeleteAllStudents from "./DeleteAllStudents";
import DeleteUser from "./DeleteUser";
import { UsersContextProvider } from "./UsersContext";
import MarkStudentAttendance from "./MarkStudentAttendance";
import AttendanceSheet from "../attendance/AttendanceSheet";
import { getAllUsers } from "@/lib/util/getAllUsers";
import createInitialAttList from "@/lib/util/createInitialAttList";

export default async function AdminPanel({ role }: { role: Role }) {
  const users = await getAllUsers();
  const initialAttList = await createInitialAttList(users);

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
