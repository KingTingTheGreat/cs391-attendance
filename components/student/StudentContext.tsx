"use client";
import { UserProps } from "@/types";
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
};

export const StudentContextProvider = ({
  inputUser,
  children,
}: {
  inputUser: UserProps;
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserProps>(inputUser);

  return (
    <StudentContext.Provider value={{ user, setUser }}>
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
