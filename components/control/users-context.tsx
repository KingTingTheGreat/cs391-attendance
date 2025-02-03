"use client";
import { getAttendanceList } from "@/lib/util/attendanceList";
import { Class, UserProps } from "@/types";
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
  lecAttList: string[][];
  discAttList: string[][];
};

export const UsersContextProvider = ({
  usersInput,
  children,
}: {
  usersInput: UserProps[];
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserProps[]>(usersInput);
  const [lecAttList, setLecAttList] = useState<string[][]>([[]]);
  const [discAttList, setDiscAttList] = useState<string[][]>([[]]);

  useEffect(() => {
    setLecAttList(getAttendanceList(users, Class.lecture));
    setDiscAttList(getAttendanceList(users, Class.discussion));
  }, [users]);

  return (
    <UsersContext.Provider value={{ users, setUsers, lecAttList, discAttList }}>
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
