import { getAttendanceList } from "@/lib/attendanceList";
import { Role, UserProps } from "@/types";

export default function AttendanceSheet({ users }: { users: UserProps[] }) {
  const attendanceList = getAttendanceList(users);
  console.log(attendanceList);

  return (
    <div>
      <h2>Attendance Sheet</h2>
      {users
        .filter((user) => user.role === Role.student)
        .map((user) => (
          <div key={user.email}>
            <p>{user.email}</p>
            <p>{user.role}</p>
          </div>
        ))}
    </div>
  );
}
