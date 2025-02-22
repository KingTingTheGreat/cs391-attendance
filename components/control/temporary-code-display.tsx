"use client";
import Cookie from "js-cookie";
import { Button } from "@mui/material";
import CodeDisplay from "../code-display";
import { useState } from "react";
import { generateTempCode } from "@/lib/control/generateTempCode";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { PREV_EXP_SEC_COOKIE } from "@/lib/cookies/cookies";

// 5 min default
const defaultSeconds = 5 * 60;

export default function TemporaryCodeDisplay({
  prevSeconds,
}: {
  prevSeconds?: number;
}) {
  const [tempCode, setTempCode] = useState<string | null>(null);
  const [expSeconds, setExpSeconds] = useState(prevSeconds || defaultSeconds);

  return (
    <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
      <h2 className="text-2xl font-bold text-center">Temporary Code</h2>
      <div className="flex flex-col items-center space-y-6">
        {tempCode ? (
          <>
            <CodeDisplay code={tempCode} />
            <p className="text-center text-gray-600">
              Use this code to confirm your attendance
            </p>
          </>
        ) : (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                views={["minutes", "seconds"]}
                timeSteps={{
                  minutes: 1,
                  seconds: 5,
                }}
                defaultValue={dayjs()
                  .minute(0)
                  .second(prevSeconds || defaultSeconds)}
                format={`mm:ss (${expSeconds} sec)`}
                onChange={(newDayjsDate) => {
                  if (newDayjsDate) {
                    const newExpSec =
                      newDayjsDate.minute() * 60 + newDayjsDate.second();
                    setExpSeconds(newExpSec);
                    Cookie.set(PREV_EXP_SEC_COOKIE, newExpSec.toString(), {
                      path: "/",
                    });
                  }
                }}
                sx={{ margin: "0.5rem" }}
              />
            </LocalizationProvider>
            <Button
              variant="outlined"
              sx={{ maxWidth: "275px" }}
              onClick={() => {
                generateTempCode(expSeconds).then((res) => {
                  if (!res) return;
                  setTempCode(res);
                });
              }}
            >
              Create Temporary Code for {expSeconds} Seconds
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
