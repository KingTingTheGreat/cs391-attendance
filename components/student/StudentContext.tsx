"use client";
import { AttendanceDates, UserProps } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

const StudentContext = createContext<StudentContextType | null>(null);

type StudentContextType = {
  user: UserProps;
  setUser: Dispatch<SetStateAction<UserProps>>;
  attendanceDates?: AttendanceDates;
};

export const StudentContextProvider = ({
  inputUser,
  attendanceDates,
  children,
}: {
  inputUser: UserProps;
  attendanceDates?: AttendanceDates;
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProps>(inputUser);

  return (
    <StudentContext.Provider value={{ user, setUser, attendanceDates }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext() must be used with a StudentContextProvider",
    );
  }
  return context;
};
