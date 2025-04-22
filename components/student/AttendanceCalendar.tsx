"use client";
import { formatDate, formatTime } from "@/lib/util/format";
import { AttendanceProps } from "@/types";
import { Modal } from "@mui/material";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useStudentContext } from "./StudentContext";

export default function AttendanceCalendar() {
  const { user } = useStudentContext();
  const [selAttList, setSelAttList] = useState<AttendanceProps[] | null>(null);

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
            const attList: AttendanceProps[] = [];
            for (const att of user.attendanceList) {
              if (formatDate(att.date) === formattedDate) {
                attList.push(att);
              }
            }
            if (attList.length > 0) {
              setSelAttList(attList);
            } else {
              setSelAttList(null);
            }
          }}
          selected={[...user.attendanceList.map((att) => att.date)]} // needed for rerender
        />
      </div>
      <Modal open={selAttList !== null} onClose={() => setSelAttList(null)}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-fit py-4 bg-white rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-[80%]">
            {selAttList === null || selAttList.length === 0 ? (
              <p>Something weng wrong. Please select a different date.</p>
            ) : (
              selAttList.map((att) => (
                <p key={att.date + att.class} className="p-2">
                  Present in {att.class} at{" "}
                  <span className="text-blue-700">
                    {formatTime(selAttList[0].date)}
                  </span>
                  {" on "}
                  <span className="text-blue-700">
                    {formatDate(selAttList[0].date)}
                  </span>
                </p>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
