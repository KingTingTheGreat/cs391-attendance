import { AttendanceProps, PwInfo, Role, UserProps } from "@/types";
import { Document, WithId } from "mongodb";

export default function documentToUserProps(
  data: WithId<Document>,
  includePwInfo?: boolean,
): UserProps {
  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    role: data.role as Role,
    attendanceList: data.attendanceList as AttendanceProps[],
    pwInfo: includePwInfo && data.pwInfo ? (data.pwInfo as PwInfo) : undefined,
  };
}
