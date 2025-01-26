import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { getAttendanceList, NumLong } from "@/lib/attendanceList";
import { AttendanceStatus, UserProps } from "@/types";
import DownloadSheet from "./download-sheet";
const paginationModel = { page: 0, pageSize: 10 };

export default function MuiAttendanceSheet({ users }: { users: UserProps[] }) {
  const data = getAttendanceList(users);

  const columns: GridColDef[] = data[0].map((col, i) => ({
    field: `${i}`,
    headerName: col,
    width: i < NumLong ? 150 : 90,
  }));

  return (
    <>
      <DownloadSheet attendanceList={data} />
      <Paper
        sx={{
          height: "fit-content",
          width: "80vw",
          borderWidth: "2px",
          padding: "1rem",
        }}
      >
        <DataGrid
          rows={data.slice(1)}
          getRowId={(row) => row[1]}
          getCellClassName={(cell) => {
            return cell.value === AttendanceStatus.present
              ? "bg-green-200"
              : cell.value === AttendanceStatus.absent
                ? "bg-red-200"
                : "bg-inherit";
          }}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 25, 50, 100, { value: -1, label: "All" }]}
          sx={{ border: 0, height: "100%" }}
        />
      </Paper>
    </>
  );
}
