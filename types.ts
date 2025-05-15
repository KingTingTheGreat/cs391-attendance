export enum Role {
  student = "student",
  staff = "staff",
  admin = "admin",
}

export enum Class {
  lecture = "lecture",
  discussion = "discussion",
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
  attendanceList: AttendanceProps[];
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

export type ServerFuncRes = {
  success: boolean;
  message: string;
};

export enum DayEnum {
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export type AttendanceList = { [classType: string]: (string | number)[][] };

export type AttendanceDates = { [classType: string]: Set<string> };

export type MarkResult = { user?: UserProps; message: string };

export type PresentResult =
  | { newAtt: AttendanceProps; errorMessage?: null }
  | { errorMessage: string };

export type TempCodeKeys = { [classType: string]: string };
