import { omit } from 'lodash';
import { SchemaDefinition, FilterQuery } from 'mongoose';
import User, { UserDocument } from '../models/user.model';

export function createUser(input: SchemaDefinition<UserDocument>) {
  return User.create(input).catch((err) => {
    throw new Error(err);
  });
}

export function findUser(query: FilterQuery<UserDocument>, selection: string) {
  return User.findOne(query).lean().select(selection);
}

export function checkAdminRole(id: string) {
  return User.exists({ _id: id, role: 'admin' });
}

export async function createLogin({ username, password }: { username: UserDocument['username']; password: string }) {
  const user = await User.findOne({ username }, '_id username password role');

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), 'password');
}
