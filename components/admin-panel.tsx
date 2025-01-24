"use client";
import { allUsers } from "@/lib/allUsers";
import { deleteAllStudents } from "@/lib/control/deleteAllStudents";
import { UserProps } from "@/types";
import { useEffect, useState } from "react";
import EditRole from "./edit-role";
import Loading from "./loading";
import AttendanceSheet from "./attendance-sheet";

export default function AdminPanel() {
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    allUsers().then((data) => setUsers(data));
  }, []);

  if (users === null) return <Loading />;

  return (
    <>
      <button onClick={deleteAllStudents}>Delete All Students</button>
      <EditRole users={users} />
      <AttendanceSheet users={users} />
    </>
  );
}
