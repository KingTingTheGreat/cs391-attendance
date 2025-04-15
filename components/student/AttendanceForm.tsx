import { useActionState, useState } from "react";
import markAsPresent from "@/lib/student/markAsPresent";
import { Button, TextField } from "@mui/material";
import { formatDate } from "@/lib/util/format";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { useStudentContext } from "./StudentContext";
import PresentMessage from "./PresentMessage";
import { Class } from "@/types";

export default function AttendanceForm() {
  const { user, setUser } = useStudentContext();
  const [code, setCode] = useState("");
  const today = formatDate(new Date());
  const [error, submitAction, isPending] = useActionState(async () => {
    try {
      const newAtt = await markAsPresent(code);
      setUser({
        ...user,
        attendanceList: addToAttendanceList(user.attendanceList, newAtt),
      });

      return null;
    } catch (e) {
      return e as Error;
    }
  }, null);

  return (
    <div className="flex flex-col items-center">
      <form action={submitAction} className="flex flex-col w-72">
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
      <div className="grid grid-cols-1 gap-0.5 p-2">
        {Object.keys(Class).map((classType) => {
          if (
            user.attendanceList.some(
              (att) =>
                formatDate(att.date) === today && att.class === classType,
            )
          ) {
            return (
              <PresentMessage classType={classType as Class} key={classType} />
            );
          }
        })}
      </div>
      <p className="p-0.5 text-lg text-[#F00]">{error && error.message}</p>
    </div>
  );
}
