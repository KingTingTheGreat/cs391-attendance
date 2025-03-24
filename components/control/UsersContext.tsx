"use client";
import { getAttendanceList } from "@/lib/util/getAttendanceList";
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
  attList: { [classType: string]: (string | number)[][] };
};

export const UsersContextProvider = ({
  usersInput,
  children,
}: {
  usersInput: UserProps[];
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserProps[]>(usersInput);
  const initialAttList: { [classType: string]: (string | number)[][] } = {};
  for (const clsType in Class) {
    initialAttList[clsType] = getAttendanceList(users, clsType as Class);
  }
  // maybe move this stuff to component w/ useMemo
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
