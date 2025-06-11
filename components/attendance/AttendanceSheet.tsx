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
import { Modal, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  PREV_ATTENDANCE_SORT_COOKIE,
  PREV_CLASS_TYPE_COOKIE,
} from "@/lib/cookies/cookies";
import { headers } from "@/lib/util/getAttendanceList";
import { formatDate, formatTime } from "@/lib/util/format";

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
  const { users, attList } = useUsersContext();
  const [classType, setClassType] = useState(Class.lecture);
  const [sortModel, setSortModel] = useState<GridSortModel>(defaultSortModel);
  const [selCell, setSelCell] = useState<{
    name: string;
    email: string;
    date: string;
    time: string;
    status: AttendanceStatus;
    performedBy?: string;
    permittedBy?: string;
  } | null>(null);
  const attendanceList = attList[classType];

  const columns: GridColDef[] = attendanceList[0].map((col, i) => ({
    field: `${i}`,
    // headers are always string, so this is fine
    headerName: col as string,
    width: headerWidth(col as string),
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
            if (!newCls) {
              return;
            }
            setClassType(newCls as Class);
            Cookie.set(PREV_CLASS_TYPE_COOKIE, newCls, {
              maxAge: 100 * 365 * 24 * 60 * 60 * 1000,
              path: "/",
            });
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
            if (headers.includes(cell.colDef.headerName as string)) {
              return "bg-inherit";
            }
            return (
              "cursor-pointer " +
              (cell.value.includes(":")
                ? "bg-green-200"
                : cell.value === AttendanceStatus.absent
                  ? "bg-red-200"
                  : "bg-inherit")
            );
          }}
          onCellClick={(cell) => {
            if (headers.includes(cell.colDef.headerName as string)) {
              return;
            }
            const att = users
              .find((u) => u.email === cell.id.toString())
              ?.attendanceList.find(
                (att) =>
                  formatDate(att.date) === cell.colDef.headerName &&
                  att.class === classType,
              );
            setSelCell({
              name: cell.row[0],
              email: cell.id.toString(),
              date: cell.colDef.headerName as string,
              time: cell.value as string,
              status:
                att && formatTime(att.date) === (cell.value as string)
                  ? AttendanceStatus.present
                  : AttendanceStatus.absent,
              performedBy: att && att.performedBy,
              permittedBy: att && att.permittedBy,
            });
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
              { maxAge: 100 * 365 * 24 * 60 * 60 * 1000, path: "/" },
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
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: `cs391-attendance-${classType}`,
              },
            },
          }}
        />
      </Paper>
      <Modal open={selCell !== null} onClose={() => setSelCell(null)}>
        {selCell !== null ? (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-fit h-fit py-4 bg-white rounded-3xl flex flex-col items-center justify-center text-center"
          >
            <div className="w-[90%]">
              {selCell.status === AttendanceStatus.present ? (
                <p>
                  {selCell.name} ({selCell.email}) marked as{" "}
                  <span className="text-green-700">{selCell.status}</span> at{" "}
                  <span className="text-blue-700">{selCell.time}</span> on{" "}
                  <span className="text-blue-700">{selCell.date}</span>
                </p>
              ) : (
                <p>
                  {selCell.name} ({selCell.email}) marked as{" "}
                  <span className="text-red-700">{selCell.status}</span> on{" "}
                  <span className="text-blue-700">{selCell.date}</span>
                </p>
              )}
              {selCell.performedBy && (
                <p>
                  Performed by:{" "}
                  <span className="text-blue-700">{selCell.performedBy}</span>
                </p>
              )}
              {selCell.permittedBy && (
                <p>
                  Permitted by:{" "}
                  <span className="text-blue-700">{selCell.permittedBy}</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
}
