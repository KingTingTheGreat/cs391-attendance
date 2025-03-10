import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { NumLong } from "@/lib/util/attendanceList";
import { AttendanceStatus, Class } from "@/types";
import { useUsersContext } from "../control/UsersContext";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import DownloadSheet from "./DownloadSheet";
const paginationModel = { page: 0, pageSize: 10 };

export default function AttendanceSheet() {
  const { lecAttList, discAttList } = useUsersContext();
  const [classType, setClassType] = useState(Class.lecture);
  const attendanceList = classType === Class.lecture ? lecAttList : discAttList;

  const columns: GridColDef[] = attendanceList[0].map((col, i) => ({
    field: `${i}`,
    headerName: col,
    width: i < NumLong ? 150 : 115,
  }));

  return (
    <>
      <h2 className="font-bold text-3xl text-center">
        {classType === Class.lecture
          ? "Lecture Attendance"
          : "Discussion Attendance"}
      </h2>
      <div className="p-1 m-0.5 flex flex-col sm:flex-row justify-center">
        <ToggleButtonGroup
          color="primary"
          value={classType}
          exclusive
          onChange={(_, newCls) => setClassType(newCls as Class)}
        >
          {Object.keys(Class).map((cls) => (
            <ToggleButton key={cls} value={cls}>
              {cls}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <DownloadSheet classType={classType} />
      </div>
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
          slots={{
            noRowsOverlay: () => (
              <GridOverlay>
                <div>No Students</div>
              </GridOverlay>
            ),
          }}
        />
      </Paper>
    </>
  );
}
