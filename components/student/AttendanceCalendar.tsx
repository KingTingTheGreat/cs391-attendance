"use client";
import { formatDate, formatTime } from "@/lib/util/format";
import { AttendanceProps } from "@/types";
import { Modal } from "@mui/material";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useStudentContext } from "./StudentContext";

export default function AttendanceCalendar() {
  const { user } = useStudentContext();
  const [selAtt, setSelAtt] = useState<AttendanceProps | null>(null);

  return (
    <>
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
    </>
  );
}
