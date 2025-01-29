import { UserProps } from "@/types";

export function parseUser(user: UserProps): UserProps | null {
  if (!user) return null;

  return {
    ...user,
    attendanceList: user.attendanceList.map((att) => ({
      class: att.class,
      date: new Date(att.date),
    })),
  };
}
