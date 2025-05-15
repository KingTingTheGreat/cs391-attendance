"use client";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Button } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CodeDisplay from "../CodeDisplay";
import { useEffect, useRef, useState } from "react";
import { formatSeconds } from "@/lib/util/format";
import { Class, TempCodeKeys } from "@/types";
import QRCodeDisplay from "../QRCodeDisplay";
import {
  createInputTotp,
  createScanTotp,
  INPUT_TEMP_CODE_PERIOD,
  SCAN_TEMP_CODE_PERIOD,
} from "@/lib/temporary-code/createTotpObj";
import { TOTP } from "otpauth";

export default function TemporaryCodeDisplay({
  scanTempCodeKeys,
  inputTempCodeKeys,
  prevSize,
}: {
  scanTempCodeKeys: TempCodeKeys;
  inputTempCodeKeys: TempCodeKeys;
  prevSize?: number;
}) {
  const inputTotpRef = useRef<TOTP | null>(null);
  const [inputTempCode, setInputTempCode] = useState<string | null>();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const scanTotpRef = useRef<TOTP | null>(null);
  const [scanTempCode, setScanTempCode] = useState<string | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [classType, setClassType] = useState<Class | null>(null);

  const generateInputTempCode = () => {
    if (classType === null) return;

    if (inputTotpRef.current === null) {
      inputTotpRef.current = createInputTotp(
        classType,
        inputTempCodeKeys[classType],
      );
    }

    setInputTempCode(inputTotpRef.current.generate());
    setTimeLeft(INPUT_TEMP_CODE_PERIOD);
  };

  const generateScanTempCode = () => {
    if (classType === null) return;

    if (scanTotpRef.current === null) {
      scanTotpRef.current = createScanTotp(
        classType,
        scanTempCodeKeys[classType],
      );
    }

    setScanTempCode(scanTotpRef.current.generate());
  };

  const handleStart = () => {
    if (classType === null) return;

    generateInputTempCode();
    generateScanTempCode();

    setIsActive(true);
  };

  const clearInputTempCode = () => {
    inputTotpRef.current = null;
    setInputTempCode(null);
    setTimeLeft(null);
  };

  const clearScanTempCode = () => {
    scanTotpRef.current = null;
    setScanTempCode(null);
  };

  const handleStop = () => {
    clearInputTempCode();
    clearScanTempCode();

    setIsActive(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      if (timeLeft !== null && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
        }, 1000);
      } else if (timeLeft === 0) {
        generateInputTempCode();
      }
    } else {
      clearInputTempCode();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        generateScanTempCode();
      }, SCAN_TEMP_CODE_PERIOD * 1000);
    } else {
      clearScanTempCode();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

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
            {inputTempCode ? (
              <>
                <CodeDisplay code={inputTempCode} show={true} />
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
                            timeLeft <= 3 ? "text-[#F00]" : "text-inherit"
                          }
                        >
                          {formatSeconds(timeLeft)}
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
      <QRCodeDisplay prevSize={prevSize} code={scanTempCode ?? undefined} />
    </>
  );
}
