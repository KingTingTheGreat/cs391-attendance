import { UserProps } from "@/types";

export function parseUserString(userString: string): UserProps | null {
  const data = JSON.parse(userString) as UserProps;
  if (!data) return null;

  return {
    ...data,
    attendanceList: data.attendanceList.map((att) => ({
      class: att.class,
      date: new Date(att.date),
    })),
  };
}
