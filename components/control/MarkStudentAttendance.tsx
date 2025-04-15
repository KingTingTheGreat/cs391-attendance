"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useActionState, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUsersContext } from "./UsersContext";
import { Button } from "@mui/material";
import { markStudentPresent } from "@/lib/control/markStudentPresent";
import { Class, Role, UserProps } from "@/types";
import { markStudentAbsent } from "@/lib/control/markStudentAbsent";
import { formatDate } from "@/lib/util/format";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import UserSelect from "./UserSelect";

export default function MarkStudentAttendance() {
  const { users, setUsers } = useUsersContext();
  const [dayjsDate, setDayjsDate] = useState<Dayjs>(dayjs(new Date()));
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [resMsg, setResMsg] = useState("");

  const [error, submitAction, isPending] = useActionState(
    async (
      _: Error | null,
      data: { attType: "present"; classType: Class } | { attType: "absent" },
    ) => {
      console.log("attType", data.attType);
      try {
        if (!selectedUser) throw new Error("no user selected");
        if (data.attType === "present") {
          setResMsg(
            await markStudentPresent(
              selectedUser.email,
              dayjsDate.toDate(),
              data.classType,
            ),
          );
          setUsers(
            users.map((user) =>
              user.email === selectedUser.email
                ? {
                    ...user,
                    attendanceList: addToAttendanceList(user.attendanceList, {
                      class: data.classType,
                      date: dayjsDate.toDate(),
                    }),
                  }
                : user,
            ),
          );
        } else if (data.attType === "absent") {
          setResMsg(
            await markStudentAbsent(selectedUser.email, dayjsDate.toDate()),
          );
          setUsers(
            users.map((user) =>
              user.email === selectedUser.email
                ? {
                    ...user,
                    attendanceList: user.attendanceList.filter(
                      (att) =>
                        formatDate(att.date) !== formatDate(dayjsDate.toDate()),
                    ),
                  }
                : user,
            ),
          );
        }

        return null;
      } catch (e) {
        setResMsg("");
        return e as Error;
      }
    },
    null,
  );

  return (
    <div className="p-2 m-2 w-fit max-w-82 flex flex-col lg:block mx-3">
      <h3 className="text-2xl font-semibold text-center w-full m-3">
        Mark Attendance
      </h3>
      <UserSelect
        val={selectedUser}
        setVal={setSelectedUser}
        filterFunc={(user) => user.role === Role.student}
        disabled={isPending}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
        <DateTimePicker
          value={dayjsDate}
          sx={{ margin: "0.25rem", width: "100%" }}
          onChange={(newDayjsDate) => {
            if (newDayjsDate) setDayjsDate(newDayjsDate);
          }}
          disabled={isPending}
        />
      </LocalizationProvider>
      <div className="m-2 flex flex-col items-center">
        <div className="flex justify-around w-full">
          {Object.keys(Class).map((classType) => (
            <form
              key={classType}
              action={() =>
                submitAction({
                  attType: "present",
                  classType: classType as Class,
                })
              }
              className="w-[40%]"
            >
              <Button
                disabled={!selectedUser || isPending}
                variant="contained"
                sx={{ width: "100%", height: "50px" }}
                type="submit"
              >
                {classType}
              </Button>
            </form>
          ))}
        </div>
        <form
          action={() => submitAction({ attType: "absent" })}
          className="w-full m-2"
        >
          <Button
            disabled={!selectedUser || isPending}
            variant="outlined"
            sx={{ width: "100%", height: "50px" }}
            type="submit"
          >
            Absent
          </Button>
        </form>
      </div>
      <p className="text-center text-[#F00]">{error && error.message}</p>
      <p className="text-center">{resMsg}</p>
    </div>
  );
}
