"use client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useActionState, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useUsersContext } from "./UsersContext";
import { Autocomplete, Button, TextField } from "@mui/material";
import { markStudentPresent } from "@/lib/control/markStudentPresent";
import { Class, Role, UserProps } from "@/types";
import { markStudentAbsent } from "@/lib/control/markStudentAbsent";
import UserSelect from "./UserSelect";

export default function MarkStudentAttendance() {
  const { users, setUsers } = useUsersContext();
  const [dayjsDate, setDayjsDate] = useState<Dayjs>(dayjs(new Date()));
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [resMsg, setResMsg] = useState("");
  const [classType, setClassType] = useState<Class | null>(null);

  const [error, submitAction, isPending] = useActionState(
    async (_: Error | null, attType: "present" | "absent") => {
      console.log("attType", attType);
      try {
        if (!selectedUser) throw new Error("no user selected");
        const result = await (function () {
          switch (attType) {
            case "present":
              return markStudentPresent(
                selectedUser.email,
                dayjsDate.toDate(),
                classType as Class,
              );
            case "absent":
              return markStudentAbsent(
                selectedUser.email,
                dayjsDate.toDate(),
                classType as Class,
              );
          }
        })();

        if (result.user !== undefined) {
          setUsers(
            users.map((user) =>
              user.email === selectedUser.email && result.user
                ? result.user
                : user,
            ),
          );
        }

        setResMsg(result.message);

        return null;
      } catch (e) {
        setResMsg("");
        return e as Error;
      }
    },
    null,
  );

  return (
    <div className="p-2 m-2 w-82 max-w-82 flex flex-col lg:block mx-3">
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
      <Autocomplete
        disablePortal
        disabled={isPending}
        options={Object.keys(Class).map((clsType) => clsType)}
        sx={{
          margin: "0.25rem",
          width: "100%",
        }}
        renderInput={(params) => <TextField {...params} label="Class Type" />}
        value={classType}
        onChange={(_, val) => setClassType(val as Class)}
      />
      <div className="flex justify-between w-full m-[0.25rem]">
        <form action={() => submitAction("present")} className="w-[40%]">
          <Button
            disabled={!selectedUser || isPending || !classType}
            variant="contained"
            sx={{ width: "100%", height: "50px" }}
            type="submit"
          >
            Present
          </Button>
        </form>
        <form action={() => submitAction("absent")} className="w-[40%]">
          <Button
            disabled={!selectedUser || isPending || !classType}
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
