"use client";
import CodeDisplay from "@/components/CodeDisplay";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { todayCode } from "@/lib/generateCode";
import { Class } from "@/types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export default function TodayCodeDisplay({ prevSize }: { prevSize: number }) {
  const [classType, setClassType] = useState<Class | null>(null);

  return (
    <div className="p-1 m-2 flex flex-col items-center text-xl max-w-[90vw] text-center">
      <h2 className="text-2xl font-bold text-center">Today&apos;s Code</h2>
      <div className="flex flex-col items-center space-y-4">
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
        <CodeDisplay code={classType ? todayCode(classType) : undefined} />
        <p className="text-center text-gray-600">
          Use this code to confirm your attendance
        </p>
      </div>
      <QRCodeDisplay prevSize={prevSize} />
    </div>
  );
}
