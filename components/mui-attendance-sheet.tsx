import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { NumLong } from "@/lib/attendanceList";
import { AttendanceStatus } from "@/types";
import DownloadSheet from "./download-sheet";
import { useUsersContext } from "./users-context";
const paginationModel = { page: 0, pageSize: 10 };

export default function MuiAttendanceSheet() {
  const { attendanceList } = useUsersContext();

  const columns: GridColDef[] = attendanceList[0].map((col, i) => ({
    field: `${i}`,
    headerName: col,
    width: i < NumLong ? 150 : 115,
  }));

  return (
    <>
      <DownloadSheet />
      <Paper
        sx={{
          height: "fit-content",
          width: "80vw",
          borderWidth: "2px",
          padding: "1rem",
        }}
      >
        <DataGrid
          rows={attendanceList.slice(1)}
          getRowId={(row) => row[1]}
          getCellClassName={(cell) => {
            // assumes students names and emails will not contain a colon
            return cell.value.includes(":")
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
