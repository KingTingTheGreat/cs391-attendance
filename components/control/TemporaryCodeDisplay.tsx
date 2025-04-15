"use client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Cookie from "js-cookie";
import { Button, FormControlLabel, Switch } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CodeDisplay from "../CodeDisplay";
import { useEffect, useState } from "react";
import { generateTempCode } from "@/lib/control/generateTempCode";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  PREV_EXP_SEC_COOKIE,
  PREV_REPEAT_TEMP_COOKIE,
} from "@/lib/cookies/cookies";
import { formatSeconds } from "@/lib/util/format";
import { Class } from "@/types";

// 5 min default
const defaultSeconds = 5 * 60;

export default function TemporaryCodeDisplay({
  prevSeconds,
  prevRepeatTemp,
}: {
  prevSeconds?: number;
  prevRepeatTemp?: boolean;
}) {
  const [tempCode, setTempCode] = useState<string | null>(null);
  const [expSeconds, setExpSeconds] = useState(
    isNaN(prevSeconds || NaN) ? defaultSeconds : (prevSeconds as number),
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [repeat, setRepeat] = useState(prevRepeatTemp as boolean);
  const [classType, setClassType] = useState<Class | null>(null);

  const handleStart = () => {
    console.log("handle start");
    generateTempCode(expSeconds, Class.discussion).then((res) => {
      if (!res) return;
      setTempCode(res);
      setIsActive(true);
      setTimeLeft(expSeconds);
    });
  };

  const handleStop = () => {
    setTempCode(null);
    setIsActive(false);
    setTimeLeft(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      if (repeat) {
        handleStart();
      } else {
        handleStop();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft, repeat]);

  return (
    <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
      <h2 className="text-2xl font-bold text-center">Temporary Code</h2>
      <div className="flex flex-col items-center space-y-6">
        {tempCode ? (
          <>
            <CodeDisplay code={tempCode} show={true} />
            <p className="text-center text-gray-600">
              Use this code to confirm your attendance
            </p>
            {timeLeft !== null && (
              <div className="flex justify-center items-center">
                <div className="text-4xl font-bold mr-4">
                  <p>Time Left: {formatSeconds(timeLeft)}</p>
                </div>
                <Button onClick={handleStop}>
                  <CancelIcon sx={{ color: "red" }} fontSize="large" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="p-1 m-0.5 flex flex-col sm:flex-row items-center justify-center w-full ">
              <ToggleButtonGroup
                color="primary"
                value={classType}
                exclusive
                onChange={(_, newCls) => {
                  console.log("new class", newCls);
                  setClassType(newCls as Class);
                }}
              >
                {Object.keys(Class).map((cls) => (
                  <ToggleButton
                    key={cls}
                    value={cls}
                    sx={{ width: "125px", paddingY: "10px", paddingX: "25px" }}
                  >
                    {cls}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                views={["minutes", "seconds"]}
                timeSteps={{
                  minutes: 1,
                  seconds: 5,
                }}
                value={dayjs().minute(0).second(expSeconds)}
                format={`mm:ss (${expSeconds} sec)`}
                onChange={(newDayjsDate) => {
                  if (newDayjsDate) {
                    const newExpSec =
                      newDayjsDate.minute() * 60 + newDayjsDate.second();
                    setExpSeconds(newExpSec);
                    Cookie.set(PREV_EXP_SEC_COOKIE, newExpSec.toString());
                  }
                }}
                sx={{ margin: "0.5rem", maxWidth: "250px" }}
              />
            </LocalizationProvider>
            <div className="flex justify-around w-full">
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={prevRepeatTemp}
                    value={repeat}
                    onChange={(_, v) => {
                      setRepeat(v);
                      Cookie.set(PREV_REPEAT_TEMP_COOKIE, String(v));
                    }}
                  />
                }
                label="Repeat?"
                labelPlacement="start"
              />
              <Button
                variant="contained"
                sx={{ maxWidth: "275px" }}
                onClick={handleStart}
                disabled={classType === null}
              >
                Create
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
