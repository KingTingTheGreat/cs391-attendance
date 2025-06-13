import getCollection, { USERS_COLLECTION } from "@/db";
import { Role, UserProps } from "@/types";
import documentToUserProps from "./documentToUserProps";

export default async function getUsersByRole(
  roles: Role[],
): Promise<UserProps[]> {
  const usersCollection = await getCollection(USERS_COLLECTION);
  const users = await usersCollection.find({ role: { $in: roles } }).toArray();

  return users.map((user) => documentToUserProps(user));
}
