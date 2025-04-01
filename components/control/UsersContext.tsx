"use client";
import { getAttendanceList } from "@/lib/util/getAttendanceList";
import { AttendanceList, Class, UserProps } from "@/types";
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
  attList: AttendanceList;
};

export const UsersContextProvider = ({
  usersInput,
  initialAttList,
  children,
}: {
  usersInput: UserProps[];
  initialAttList: AttendanceList;
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserProps[]>(usersInput);
  const [attList, setAttList] = useState(initialAttList);

  useEffect(() => {
    const tmp = { ...attList };
    for (const clsType in Class) {
      tmp[clsType] = getAttendanceList(users, clsType as Class);
    }
    setAttList(tmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <UsersContext.Provider value={{ users, setUsers, attList }}>
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
