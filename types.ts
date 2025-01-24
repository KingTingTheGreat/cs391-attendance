export enum Role {
  Student = "student",
  Staff = "staff",
  Admin = "admin",
}

export enum Class {
  Lecture = "lecture",
}

export type AttendanceProps = {
  class: Class;
  date: Date;
};

export type UserProps = {
  name: string;
  email: string;
  picture: string;
  role: Role;
  sessionIdList?: string[];
  attendanceList?: AttendanceProps[];
};

export type GoogleUserProps = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  hd: string;
};
