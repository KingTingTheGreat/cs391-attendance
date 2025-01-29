import { AttendanceProps, Role } from "@/types";
import { Document, WithId } from "mongodb";

export default function documentToUserProps(data: WithId<Document>) {
  return {
    name: data.name,
    email: data.email,
    picture: data.picture,
    role: data.role as Role,
    attendanceList: data.attendanceList as AttendanceProps[],
  };
}
