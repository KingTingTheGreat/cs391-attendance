"use client";
import { allUsers } from "@/lib/allUsers";
import { deleteAllStudents } from "@/lib/control/deleteAllStudents";
import { UserProps } from "@/types";
import { useEffect, useState } from "react";
import EditRole from "./edit-role";
import Loading from "./loading";
import MuiAttendanceSheet from "./mui-attendance-sheet";

export default function AdminPanel() {
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    allUsers().then((data) => setUsers(data));
  }, []);

  if (users === null) return <Loading />;

  return (
    <>
      <EditRole users={users} />
      <div className="flex flex-col items-center p-8">
        <MuiAttendanceSheet users={users} />
      </div>
      <button onClick={deleteAllStudents}>Delete All Students</button>
    </>
  );
}
