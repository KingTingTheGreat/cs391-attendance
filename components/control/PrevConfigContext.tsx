"use client";
import { Class } from "@/types";
import { GridSortModel } from "@mui/x-data-grid";
import { createContext, useContext } from "react";

const PrevConfigContext = createContext<PrevConfigContextType | null>(null);

type PrevConfigContextType = {
  prevExpSec?: number;
  prevClassType?: Class;
  prevSize?: number;
  prevSortModel?: GridSortModel;
  prevRepeatTemp?: boolean;
};

export const PrevConfigContextProvider = ({
  prevExpSec,
  prevClassType,
  prevSize,
  prevSortModel,
  prevRepeatTemp,
  children,
}: {
  prevExpSec?: number;
  prevClassType?: Class;
  prevSize?: number;
  prevSortModel?: GridSortModel;
  prevRepeatTemp?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <PrevConfigContext.Provider
      value={{
        prevExpSec,
        prevClassType,
        prevSize,
        prevSortModel,
        prevRepeatTemp,
      }}
    >
      {children}
    </PrevConfigContext.Provider>
  );
};

export const usePrevConfigContext = (): PrevConfigContextType => {
  const context = useContext(PrevConfigContext);
  if (!context) {
    throw new Error(
      "usePrevConfigContext() must be used with a PrevConfigContextProvider",
    );
  }
  return context;
};
