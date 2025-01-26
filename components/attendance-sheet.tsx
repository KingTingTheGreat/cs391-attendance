import { getAttendanceList, NumLong } from "@/lib/attendanceList";
import { AttendanceStatus, UserProps } from "@/types";

export default function AttendanceSheet({ users }: { users: UserProps[] }) {
  const attendanceList = getAttendanceList(users);

  return (
    <div>
      <h2>Attendance Sheet</h2>
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
            <tr key={data[1]}>
              {data.map((status, i) => (
                <td
                  key={data[1] + status + i}
                  className="text-center border-2 p-2"
                  style={{
                    backgroundColor:
                      i < NumLong
                        ? "inherit"
                        : status === AttendanceStatus.present
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
    </div>
  );
}
