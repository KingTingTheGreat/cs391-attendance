"use client";
import markAsPresent from "@/lib/student/markAsPresent";
import Image from "next/image";
import { useState, useTransition } from "react";
import { AttendanceProps, Class, UserProps } from "@/types";
import { formatDate, formatTime } from "@/lib/util/format";
import { Button, Modal, TextField } from "@mui/material";
import { addToAttendanceList } from "@/lib/util/addToAttendanceList";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function StudentProfile({
  userInput,
}: {
  userInput: UserProps;
}) {
  const [user, setUser] = useState(userInput);
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formatToday = formatDate(new Date());
  const [present, setPresent] = useState(
    user.attendanceList.some((att) => formatDate(att.date) === formatToday),
  );
  const [isPending, startTransition] = useTransition();
  const [selAtt, setSelAtt] = useState<AttendanceProps | null>(null);

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

  const interactive = !present ? (
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
  );

  return (
    <div>
      <p className="text-2xl font-bold text-center mb-6">
        Hello there, {user.name}!
      </p>
      <div className="flex justify-center mb-6">
        <Image
          src={user.picture}
          alt="profile picture"
          width={128}
          height={128}
          className="rounded-full"
        />
      </div>
      <div className="flex justify-center">{interactive}</div>
      <p className="p-2 text-lg text-[#F00]">{errorMessage}</p>
      <div className="p-2 m-2 flex flex-col items-center">
        <h4 className="text-lg md:text-xl text-center font-semibold">
          Dates you&apos;ve been marked as present:
        </h4>
        <DayPicker
          mode="multiple"
          className="m-2"
          onSelect={(_, d) => {
            const formattedDate = formatDate(d);
            const i = user.attendanceList.findIndex(
              (att) => formatDate(att.date) === formattedDate,
            );
            if (i !== -1) {
              setSelAtt(user.attendanceList[i]);
            }
          }}
          selected={[...user.attendanceList.map((att) => att.date)]} // needed for rerender
        />
      </div>
      <Modal open={selAtt !== null} onClose={() => setSelAtt(null)}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-44 bg-white rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-[80%]">
            {selAtt === null ? (
              <p>Something weng wrong. Please select a different date.</p>
            ) : (
              <p>
                Marked present at{" "}
                <span className="text-blue-700">{formatTime(selAtt.date)}</span>
                {" on "}
                <span className="text-blue-700">{formatDate(selAtt.date)}</span>
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
