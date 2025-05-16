"use client";
import CodeDisplay from "@/components/CodeDisplay";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { Class } from "@/types";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateTodayCode } from "@/lib/control/generateTodayCode";

const staleTime = 20 * 60 * 1000;

export default function TodayCodeDisplay() {
  const [classType, setClassType] = useState<Class | null>(null);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [classType],
    queryFn: () => (classType ? generateTodayCode(classType) : null),
    staleTime,
  });

  useEffect(() => {
    Object.keys(Class).forEach((classType) => {
      queryClient.prefetchQuery({
        queryKey: [classType],
        queryFn: () => generateTodayCode(classType as Class),
        staleTime,
      });
    });
  }, [queryClient]);

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
        <CodeDisplay code={query.data ?? undefined} />
        <p className="text-center text-gray-600">
          Use this code to confirm your attendance
        </p>
      </div>
      <QRCodeDisplay />
    </div>
  );
}
