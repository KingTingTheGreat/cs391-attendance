import { useState, useTransition } from "react";
import markAsPresent from "@/lib/student/markAsPresent";
import { Button, TextField } from "@mui/material";
import { Class } from "@/types";
import { formatDate } from "@/lib/util/format";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { useStudentContext } from "./StudentContext";

export default function AttendanceForm() {
  const { user, setUser } = useStudentContext();
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const today = formatDate(new Date());
  const [present, setPresent] = useState(
    user.attendanceList.some((att) => formatDate(att.date) === today),
  );

  const processPresentRes = (errMsg: string | null) => {
    if (errMsg === null) {
      setUser({
        ...user,
        attendanceList: addToAttendanceList(user.attendanceList, {
          class: Class.lecture,
          date: new Date(),
        }),
      });
      setPresent(true);
      setErrorMessage("");
    } else {
      setErrorMessage(errMsg);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!present ? (
        <form
          action={() => {
            startTransition(() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                  markAsPresent(
                    code,
                    pos.coords.longitude,
                    pos.coords.latitude,
                  ).then(processPresentRes);
                });
              } else {
                markAsPresent(code).then(processPresentRes);
              }
            });
          }}
          className="flex flex-col w-72"
        >
          <TextField
            type="text"
            value={code}
            placeholder="Today's Code"
            variant="outlined"
            sx={{ margin: "0.1rem" }}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{ margin: "0.1rem" }}
          >
            {isPending
              ? "Marking you as present..."
              : "Click to indicate you're in class"}
          </Button>
        </form>
      ) : (
        <div className="text-center p-4 bg-green-100 text-green-700 rounded-md">
          You have been marked present for today!
        </div>
      )}
      <p className="p-2 text-lg text-[#F00]">{errorMessage}</p>
    </div>
  );
}
