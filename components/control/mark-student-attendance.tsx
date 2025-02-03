"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUsersContext } from "./users-context";
import { Button, MenuItem, Select } from "@mui/material";
import { markStudentPresent } from "@/lib/control/markStudentPresent";
import { Class, Role } from "@/types";
import { markStudentAbsent } from "@/lib/control/markStudentAbsent";
import { formatDate, formatDay } from "@/lib/util/format";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { DISCUSSION_DAYS } from "@/lib/env";

export default function MarkStudentAttendance() {
  const { users, setUsers } = useUsersContext();
  const [dayjsDate, setDayjsDate] = useState<Dayjs>(dayjs(new Date()));
  const [selectedEmail, setSelectedEmail] = useState("");
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit flex flex-col lg:block">
      <h3 className="text-2xl font-semibold text-center w-full">
        Mark Student Attendance
      </h3>
      <Select
        onChange={(e) => {
          setSelectedEmail(e.target.value as string);
        }}
        value={selectedEmail}
        sx={{ minWidth: 150, width: "fit-content", margin: "0.25rem" }}
      >
        <MenuItem value=""></MenuItem>
        {users
          .filter((user) => user.role === Role.student)
          .map((user) => (
            <MenuItem key={user.email} value={user.email}>
              {user.email}
            </MenuItem>
          ))}
      </Select>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <DateTimePicker
          value={dayjsDate}
          sx={{ margin: "0.25rem", width: "225px" }}
          onChange={(newDayjsDate) => {
            if (newDayjsDate) setDayjsDate(newDayjsDate);
          }}
        />
      </LocalizationProvider>
      <div className="inline-block">
        <Button
          disabled={!selectedEmail}
          variant="contained"
          sx={{ margin: "0.25rem" }}
          onClick={() =>
            markStudentPresent(selectedEmail, dayjsDate.toDate()).then(
              (res) => {
                if (res.success) {
                  setUsers(
                    users.map((user) =>
                      user.email === selectedEmail
                        ? {
                            ...user,
                            attendanceList: addToAttendanceList(
                              user.attendanceList,
                              {
                                class: DISCUSSION_DAYS.includes(
                                  formatDay(dayjsDate.toDate()),
                                )
                                  ? Class.Discussion
                                  : Class.Lecture,
                                date: dayjsDate.toDate(),
                              },
                            ),
                          }
                        : user,
                    ),
                  );
                }
                setResMsg(res.message);
              },
            )
          }
        >
          Present
        </Button>
        <Button
          disabled={!selectedEmail}
          variant="outlined"
          sx={{ margin: "0.25rem" }}
          onClick={() =>
            markStudentAbsent(selectedEmail, dayjsDate.toDate()).then((res) => {
              if (res.success) {
                setUsers(
                  users.map((user) =>
                    user.email !== selectedEmail
                      ? user
                      : {
                          ...user,
                          attendanceList: user.attendanceList.filter(
                            (att) =>
                              formatDate(att.date) !==
                              formatDate(dayjsDate.toDate()),
                          ),
                        },
                  ),
                );
              }
              setResMsg(res.message);
            })
          }
        >
          Absent
        </Button>
      </div>
      <p className="text-center">{resMsg}</p>
    </div>
  );
}
