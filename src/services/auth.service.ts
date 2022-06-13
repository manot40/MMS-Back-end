import config from '../config/jwt';
import { LeanDocument, FilterQuery, UpdateQuery } from 'mongoose';
import { get } from 'lodash';
import { UserDocument } from '../models/user.model';
import Session, { SessionDocument } from '../models/session.model';
import { sign, decode } from '../helpers/jwt';
import { findUser } from './user.service';
import log from '../helpers/pino';

export async function createSession(userId: string, userAgent: string) {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
}

export function createAccessToken({
  user,
  session,
}: {
  user: Omit<UserDocument, 'password'> | LeanDocument<Omit<UserDocument, 'password'>>;
  session: Omit<SessionDocument, 'password'> | LeanDocument<Omit<SessionDocument, 'password'>>;
}) {
  // Build and return the new access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: config.accessTokenTTL } // 30 minutes
  );

  return accessToken;
}

export async function reIssueAccessToken(token: string) {
  // Decode the refresh token
  const { decoded } = decode(token);
  if (!decoded || !get(decoded, '_id')) return false;

  // Get the session
  const session = await Session.findById(get(decoded, '_id'));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user }, '_id username').catch((err) => log.error('Fail service to reIssueAccessToken | ' + err));

  if (!user) {
    return false;
  }

  const accessToken = createAccessToken({ user, session });

  return accessToken;
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
  return Session.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean();
}

export async function deleteSessions(query: FilterQuery<SessionDocument>) {
  return Session.deleteMany(query).lean();
}
