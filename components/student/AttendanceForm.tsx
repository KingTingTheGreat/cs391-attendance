import { useState, useTransition } from "react";
import markAsPresent from "@/lib/student/markAsPresent";
import { Button, TextField } from "@mui/material";
import { formatDate } from "@/lib/util/format";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { useStudentContext } from "./StudentContext";
import PresentMessage from "./PresentMessage";
import { Class } from "@/types";
import QrScanner from "./QrScanner";

export default function AttendanceForm() {
  const { user, setUser } = useStudentContext();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const today = formatDate(new Date());

  async function submitCode(code: string) {
    if (!code) {
      setError("a code is required");
      return;
    }
    try {
      const res = await markAsPresent(code);
      if (res.errorMessage !== null && res.errorMessage !== undefined) {
        setError(res.errorMessage);
        return;
      }

      setError(null);
      setUser({
        ...user,
        attendanceList: addToAttendanceList(user.attendanceList, res.newAtt),
      });
    } catch (e) {
      console.log("error", e);
      setError("something went wrong. please try again later.");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <form
        action={() => startTransition(() => submitCode(code))}
        className="flex flex-col w-72"
      >
        <TextField
          type="number"
          value={code}
          placeholder="Today's Code"
          variant="outlined"
          sx={{
            margin: "0.1rem",
            fontSize: "1.5rem",
            textAlign: "center",
            "& input": {
              textAlign: "center",
            },
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
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
      <QrScanner
        onScan={(scannedCode: string) => {
          startTransition(() => {
            submitCode(scannedCode);
          });
        }}
      />
      <p className="p-0.5 text-lg text-[#F00] mt-1">{error}</p>
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
    </div>
  );
}
