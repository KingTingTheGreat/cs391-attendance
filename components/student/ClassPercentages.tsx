"use client";
import { Class } from "@/types";
import { useStudentContext } from "./StudentContext";
import formatPercentage, { formatDate } from "@/lib/util/format";
import { Modal } from "@mui/material";
import { useState } from "react";

const minPercentages = new Map<Class, number>([
  [Class.lecture, 85],
  [Class.discussion, 10 / 12],
]);

export default function ClassPercentages() {
  const { user, attendanceDates } = useStudentContext();
  const [selClassType, setSelClassType] = useState<Class | null>(null);

  if (!attendanceDates) return <></>;

  function ModalContent() {
    if (selClassType === null || !attendanceDates) {
      return <p>Something weng wrong. Please select something else.</p>;
    }

    const absentDates = Array.from(attendanceDates[selClassType]).filter(
      (d) =>
        !user.attendanceList.some(
          (att) => formatDate(att.date) === d && att.class === selClassType,
        ),
    );

    if (absentDates.length === 0) {
      return (
        <p>
          You have attended 100% of{" "}
          <span className="underline">{selClassType}</span> classes.
        </p>
      );
    }

    return (
      <p>
        You have missed the following{" "}
        <span className="underline">{selClassType}</span> classes:{" "}
        <span className="text-[#F00]">{absentDates.join(", ")}</span>
      </p>
    );
  }

  return (
    <>
      <div className="px-2 pb-1 mb-4 flex flex-col items-center">
        {Object.values(Class).map((clsType) => {
          const numPresent = user.attendanceList.filter(
            (d) => d.class === clsType,
          ).length;
          const minPerc = minPercentages.get(clsType);
          const percentage = formatPercentage(
            numPresent,
            attendanceDates[clsType].size,
          );
          return (
            <button
              className="cursor-pointer block hover:shadow border-solid p-2 rounded-lg"
              key={clsType}
              onClick={() => setSelClassType(clsType)}
            >
              <p>
                {clsType}:{" "}
                <span
                  className={
                    minPerc !== undefined && minPerc > 0
                      ? percentage >= minPerc
                        ? "text-green-700"
                        : "text-red-500 underline"
                      : ""
                  }
                >
                  {percentage}%
                </span>
              </p>
            </button>
          );
        })}
      </div>
      <Modal open={selClassType !== null} onClose={() => setSelClassType(null)}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
		    w-80 h-fit py-4 bg-white rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-[90%]">
            <ModalContent />
          </div>
        </div>
      </Modal>
    </>
  );
}
