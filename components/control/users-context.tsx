"use client";
import { getAttendanceList } from "@/lib/util/attendanceList";
import { UserProps } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const UsersContext = createContext<UsersContextType | null>(null);

type UsersContextType = {
  users: UserProps[];
  setUsers: Dispatch<SetStateAction<UserProps[]>>;
  attendanceList: string[][];
};

export const UsersContextProvider = ({
  usersInput,
  children,
}: {
  usersInput: UserProps[];
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserProps[]>(usersInput);
  const [attendanceList, setAttendanceList] = useState<string[][]>([[]]);

  useEffect(() => {
    setAttendanceList(getAttendanceList(users));
  }, [users]);

  return (
    <UsersContext.Provider value={{ users, setUsers, attendanceList }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error(
      "useUsersContext() must be used with a UsersContextProvider",
    );
  }
  return context;
};
