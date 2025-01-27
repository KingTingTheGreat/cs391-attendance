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

export default function MarkStudentPresent() {
  const { users, setUsers } = useUsersContext();
  const [dayjsDate, setDayjsDate] = useState<Dayjs>(dayjs(new Date()));
  const [selectedEmail, setSelectedEmail] = useState("");
  const [resMsg, setResMsg] = useState("");

  return (
    <div className="p-2 m-2 w-fit">
      <h3 className="text-2xl font-semibold text-center w-full">
        Mark Student as Present
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
          sx={{ margin: "0.25rem", width: "200px" }}
          onChange={(newDayjsDate) => {
            if (newDayjsDate) setDayjsDate(newDayjsDate);
          }}
        />
      </LocalizationProvider>
      <Button
        disabled={!selectedEmail}
        variant="contained"
        sx={{ margin: "0.25rem" }}
        onClick={() =>
          markStudentPresent(selectedEmail, dayjsDate.toDate()).then((res) => {
            if (res.success) {
              setUsers(
                users.map((user) =>
                  user.email !== selectedEmail
                    ? user
                    : {
                        ...user,
                        attendanceList: [
                          ...user.attendanceList,
                          {
                            class: Class.Lecture,
                            date: dayjsDate.toDate(),
                          },
                        ].sort((a, b) => a.date.getTime() - b.date.getTime()),
                      },
                ),
              );
            }
            setResMsg(res.message);
          })
        }
      >
        Update
      </Button>
      <p className="text-center">{resMsg}</p>
    </div>
  );
}
