import config from "../config/jwt";
import { get } from "lodash";
import { Request, Response } from "express";
import { createLogin } from "../services/user.service";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
  deleteSessions,
  reIssueAccessToken,
} from "../services/auth.service";
import msg from "../helpers/messenger";
import { sign } from "../helpers/jwt";
import log from "../helpers/pino";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await createLogin(req.body);

  if (!user) {
    return res.status(401).send(msg(401, {}, "Username atau password salah!"));
  }

  // Create a session
  const session = await createSession(user._id.toString(), req.get("user-agent") || "");

  // create access token
  // @ts-ignore
  const accessToken = createAccessToken({ user, session });

  // create refresh token
  let refreshToken;

  if (req.body.rememberMe as boolean) {
    refreshToken = sign(session, {
      expiresIn: config.refreshTokenTTL, // 1 year
    });
  } else {
    refreshToken = accessToken;
  }

  // send refresh & access token back
  return res.send({ accessToken, refreshToken });
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function refreshAccessToken(req: Request, res: Response) {
  const refreshToken = req.body;
  await reIssueAccessToken({ ...refreshToken })
    .then((accessToken) => {
      if (!accessToken) {
        return res
          .status(401)
          .send({ data: { ...refreshToken }, message: "Already logged out" });
      }
      return res.status(200).send({ accessToken });
    })
    .catch((err) => {
      log.error("Rejected Request on reIssueAccessToken | " + err);
      return res.status(500).send(msg(500, {}));
    });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const sessions = await findSessions({ valid: true });

  return res.send(sessions);
}

export async function flushExpiredTokenHandler(req: Request, res: Response) {
  const sessions = await deleteSessions({ valid: false });
  const response = {
    deletedCount: sessions.deletedCount,
  };
  return res.send(response);
}
