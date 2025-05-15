"use client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CodeDisplay from "../CodeDisplay";
import { useEffect, useState } from "react";
import { generateTempCodes } from "@/lib/control/generateTempCodes";
import { formatSeconds } from "@/lib/util/format";
import { Class, TemporaryCode } from "@/types";
import QRCodeDisplay from "../QRCodeDisplay";
import { INTERVAL_LENGTH, TTL } from "@/lib/env";

// when these number of seconds are left, display as red
const finalTimes = [...Array(3 + 1).keys()].map((s) => formatSeconds(s));

function calcTimeLeft(expiryTime: number) {
  const diff = expiryTime - Date.now();
  return diff < INTERVAL_LENGTH ? 0 : Math.round(diff / 1000);
}

export default function TemporaryCodeDisplay({
  prevSize,
}: {
  prevSize?: number;
}) {
  const [tempCodes, setTempCodes] = useState<TemporaryCode[] | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [classType, setClassType] = useState<Class | null>(null);

  const handleStart = () => {
    if (classType === null) return;

    console.log("GENERATIGN NEW CODES");
    generateTempCodes(
      TTL,
      classType,
      tempCodes && tempCodes.length > 0
        ? tempCodes[tempCodes.length - 1].end
        : undefined,
    )
      .then((res) => {
        if (!res) {
          throw new Error("failed to get new codes");
        }

        let newTempCodes = [];
        if (!tempCodes || tempCodes.length === 0) {
          newTempCodes = res;
        } else {
          const timeLeft = calcTimeLeft(tempCodes[0].end);
          if (timeLeft === 0) {
            newTempCodes = [...tempCodes.slice(1), ...res];
          } else {
            newTempCodes = res;
          }
        }

        setTempCodes(newTempCodes);
        setIsActive(true);
        setTimeLeft(formatSeconds(calcTimeLeft(newTempCodes[0].end)));
      })
      .catch(() => {
        // try again in 1 second
        setTimeout(() => {
          handleStart();
        }, 1000);

        if (!tempCodes) {
          return;
        }

        // next in queue if necessary
        const newTimeLeft = calcTimeLeft(tempCodes[0].end);
        if (newTimeLeft === 0) {
          setTempCodes(tempCodes.slice(1));
          setTimeLeft(formatSeconds(newTimeLeft));
        }
      });
  };

  const handleStop = () => {
    setTempCodes(null);
    setIsActive(false);
    setTimeLeft(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // if (isActive && timeLeft !== null && timeLeft > 0) {
    //   interval = setInterval(() => {
    //     setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
    //   }, 1000);
    // } else if (timeLeft === 0) {
    //   if (isActive) {
    //     handleStart();
    //   } else {
    //     handleStop();
    //   }
    // }

    if (
      timeLeft === null ||
      timeLeft === formatSeconds(0) ||
      !tempCodes ||
      tempCodes.length === 0
    ) {
      return isActive ? handleStart() : handleStop();
    }

    interval = setInterval(() => {
      const newTimeLeft = formatSeconds(calcTimeLeft(tempCodes[0].end));
      if (newTimeLeft !== "0:00") {
        setTimeLeft(newTimeLeft);
        return;
      }

      const newTempCodes = tempCodes.slice(1);
      // if there is only one code left, get more
      if (newTempCodes.length <= 1) {
        handleStart();
      }

      setTempCodes(newTempCodes);
      setTimeLeft(formatSeconds(calcTimeLeft(newTempCodes[0].end)));
    }, INTERVAL_LENGTH);

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  return (
    <>
      <div className="flex justify-center">
        <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
          <h2 className="text-2xl font-bold text-center">Temporary Code</h2>
          <div className="flex flex-col items-center space-y-4">
            <ToggleButtonGroup
              color="primary"
              value={classType}
              exclusive
              disabled={isActive}
              onChange={(_, newCls) => {
                console.log("new class", newCls);
                setClassType(newCls as Class);
              }}
            >
              {Object.keys(Class).map((cls) => (
                <ToggleButton
                  key={cls}
                  value={cls}
                  sx={{
                    width: "125px",
                    paddingY: "10px",
                    paddingX: "25px",
                    marginTop: "0.5rem",
                  }}
                >
                  {cls}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {tempCodes && tempCodes.length > 0 ? (
              <>
                <CodeDisplay code={tempCodes[0].code} show={true} />
                <p className="text-center text-gray-600">
                  Use this code to confirm your attendance
                </p>
                {timeLeft !== null && (
                  <div className="flex justify-center items-center">
                    <div className="text-3xl font-bold mr-4">
                      <p>
                        Time Left:{" "}
                        <span
                          className={
                            finalTimes.includes(timeLeft)
                              ? "text-[#F00]"
                              : "text-inherit"
                          }
                        >
                          {timeLeft}
                        </span>
                      </p>
                    </div>
                    <Button onClick={handleStop}>
                      <CancelIcon sx={{ color: "red" }} fontSize="large" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-around w-full">
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
      </div>
      <QRCodeDisplay
        prevSize={prevSize}
        code={tempCodes && tempCodes.length > 0 ? tempCodes[0].code : undefined}
      />
    </>
  );
}
