"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUsersContext } from "./UsersContext";
import { Button } from "@mui/material";
import { markStudentPresent } from "@/lib/control/markStudentPresent";
import { Class, Role, UserProps } from "@/types";
import { markStudentAbsent } from "@/lib/control/markStudentAbsent";
import { formatDate, formatDay } from "@/lib/util/format";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { DISCUSSION_DAYS } from "@/lib/env";
import UserSelect from "./UserSelect";

export default function MarkStudentAttendance() {
  const { users, setUsers } = useUsersContext();
  const [dayjsDate, setDayjsDate] = useState<Dayjs>(dayjs(new Date()));
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit flex flex-col lg:block w-xs mx-3">
      <h3 className="text-2xl font-semibold text-center w-full m-3">
        Mark Attendance
      </h3>
      <UserSelect
        val={selectedUser}
        setVal={setSelectedUser}
        filterFunc={(user) => user.role === Role.student}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <DateTimePicker
          value={dayjsDate}
          sx={{ margin: "0.25rem", width: "100%" }}
          onChange={(newDayjsDate) => {
            if (newDayjsDate) setDayjsDate(newDayjsDate);
          }}
        />
      </LocalizationProvider>
      <div className="flex justify-between w-full m-[0.25rem]">
        <Button
          disabled={!selectedUser}
          variant="contained"
          sx={{ width: "40%", height: "56px" }}
          onClick={() => {
            if (!selectedUser) return;
            markStudentPresent(selectedUser.email, dayjsDate.toDate()).then(
              (res) => {
                if (res.success) {
                  setUsers(
                    users.map((user) =>
                      user.email === selectedUser.email
                        ? {
                            ...user,
                            attendanceList: addToAttendanceList(
                              user.attendanceList,
                              {
                                class: DISCUSSION_DAYS.includes(
                                  formatDay(dayjsDate.toDate()),
                                )
                                  ? Class.discussion
                                  : Class.lecture,
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
            );
          }}
        >
          Present
        </Button>
        <Button
          disabled={!selectedUser}
          variant="outlined"
          sx={{ width: "40%", height: "56px" }}
          onClick={() => {
            if (!selectedUser) return;
            markStudentAbsent(selectedUser.email, dayjsDate.toDate()).then(
              (res) => {
                if (res.success) {
                  setUsers(
                    users.map((user) =>
                      user.email !== selectedUser.email
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
              },
            );
          }}
        >
          Absent
        </Button>
      </div>
      <p className="text-center">{resMsg}</p>
    </div>
  );
}
