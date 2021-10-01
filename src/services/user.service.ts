import { omit } from "lodash";
import { DocumentDefinition, FilterQuery } from "mongoose";
import User, { UserDocument } from "../models/user.model";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    return await User.create(input);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function findUser(
  query: FilterQuery<UserDocument>,
  selection: string
) {
  return User.findOne(query).lean().select(selection);
}

export async function checkAdminRole(id: string) {
  return await User.exists({ _id: id, role: "admin" });
}

export async function createLogin({
  username,
  password,
}: {
  username: UserDocument["username"];
  password: string;
}) {
  const user = await User.findOne({ username }, "_id username password role");

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), "password");
}
