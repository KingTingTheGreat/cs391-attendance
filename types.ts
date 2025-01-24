export enum Role {
  Student = "student",
  Admin = "admin",
}

export type UserProps = {
  name: string;
  email: string;
  role: Role;
};
