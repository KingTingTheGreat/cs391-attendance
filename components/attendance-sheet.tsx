import { getAttendanceList } from "@/lib/attendanceList";
import { UserProps } from "@/types";
import { useRouter } from "next/navigation";

export default function AttendanceSheet({ users }: { users: UserProps[] }) {
  const attendanceList = getAttendanceList(users);
  const router = useRouter();

  return (
    <div>
      <h2>Attendance Sheet</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/download-attendance-sheet?t=${new Date().getTime()}`);
        }}
      >
        <button type="submit">Download</button>
      </form>
      <table className="p-2 border-2 m-2">
        <thead>
          <tr>
            {attendanceList[0].map((h) => (
              <th key={h} className="text-center border-2 p-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendanceList.slice(1).map((data) => (
            <tr key={data[0]}>
              {data.map((status, i) => (
                <td
                  key={status}
                  className="text-center border-2 p-2"
                  style={{
                    backgroundColor:
                      i < 2
                        ? "inherit"
                        : status === "present"
                          ? "lightgreen"
                          : "pink",
                  }}
                >
                  {status}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {}
    </div>
  );
}
