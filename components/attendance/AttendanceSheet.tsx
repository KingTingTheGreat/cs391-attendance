"use client";
import {
  DataGrid,
  GridColDef,
  GridOverlay,
  GridSortDirection,
  GridSortModel,
  GridToolbar,
} from "@mui/x-data-grid";
import Cookie from "js-cookie";
import Paper from "@mui/material/Paper";
import { AttendanceStatus, Class } from "@/types";
import { useUsersContext } from "../control/UsersContext";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  PREV_ATTENDANCE_SORT_COOKIE,
  PREV_CLASS_TYPE_COOKIE,
} from "@/lib/cookies/cookies";
import { headers } from "@/lib/util/getAttendanceList";

const pageSizeOpts = [25, 50, 100];
const paginationModel = { page: 0, pageSize: pageSizeOpts[0] };
// default to field at index 0 (name)
const defaultSortModel = [{ field: "0", sort: "asc" as GridSortDirection }];

function headerWidth(h: string) {
  switch (h) {
    case headers[0]:
      return 150;
    case headers[1]:
      return 150;
    case headers[2]:
      return 60;
    case headers[3]:
      return 60;
    default:
      return 100;
  }
}

export default function AttendanceSheet() {
  const { attList } = useUsersContext();
  const prevClassType = Cookie.get(PREV_CLASS_TYPE_COOKIE);
  const [classType, setClassType] = useState(
    prevClassType ? (prevClassType as Class) : Class.lecture,
  );
  const prevSortModel = JSON.parse(
    Cookie.get(PREV_ATTENDANCE_SORT_COOKIE) || "[]",
  ) as GridSortModel;
  const [sortModel, setSortModel] = useState<GridSortModel>(
    prevSortModel || defaultSortModel,
  );
  const attendanceList = attList[classType];

  const columns: GridColDef[] = attendanceList[0].map((col, i) => ({
    field: `${i}`,
    headerName: col,
    width: headerWidth(col),
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
          onChange={(_, newCls) => {
            setClassType(newCls as Class);
            Cookie.set(PREV_CLASS_TYPE_COOKIE, newCls);
          }}
        >
          {Object.keys(Class).map((cls) => (
            <ToggleButton key={cls} value={cls}>
              {cls}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
          initialState={{
            pagination: { paginationModel },
            sorting: {
              sortModel,
            },
          }}
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => {
            setSortModel(newSortModel);
            Cookie.set(
              PREV_ATTENDANCE_SORT_COOKIE,
              JSON.stringify(newSortModel),
            );
          }}
          pageSizeOptions={[...pageSizeOpts, { value: -1, label: "All" }]}
          sx={{ border: 0, height: "100%" }}
          slots={{
            toolbar: GridToolbar,
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
