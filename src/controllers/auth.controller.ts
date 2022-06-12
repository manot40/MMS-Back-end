import ms from "ms";
import { get } from "lodash";
import { Request, Response } from "express";

import log from "../helpers/pino";
import config from "../config/jwt";
import { sign } from "../helpers/jwt";
import msg from "../helpers/messenger";

import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
  deleteSessions,
  reIssueAccessToken,
} from "../services/auth.service";
import { createLogin } from "../services/user.service";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the email and password
  const user = (await createLogin(req.body)) as any;
  const remember: boolean = req.body.rememberMe;

  if (!user) {
    return res.status(401).send(msg(401, {}, "Username atau password salah!"));
  }

  // Create a session
  const session = (await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  )) as any;

  const cookieConfig: any = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV == "production",
  };

  // create access token
  const accessToken = createAccessToken({ user, session });
  res.cookie("accessToken", accessToken, {
    ...cookieConfig,
    maxAge: ms(config.accessTokenTTL),
  });

  // create refresh token
  let refreshToken;
  if (remember) {
    refreshToken = sign(session, { expiresIn: config.refreshTokenTTL });
    res.cookie("refreshToken", refreshToken, {
      ...cookieConfig,
      maxAge: ms(config.refreshTokenTTL),
    });
  }

  // send refresh & access token back
  return res.send(msg(200, { accessToken, refreshToken }, "Login berhasil!"));
}

export async function invalidateUserSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .send(msg(200, {}, "Logout berhasil!"));
}

export async function refreshAccessToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;
  await reIssueAccessToken(refreshToken)
    .then((accessToken) => {
      if (!accessToken) {
        return res
          .status(401)
          .send(msg(401, { ...refreshToken }, "Already logged out"));
      }
      return res
        .status(200)
        .send(msg(200, { accessToken }, "Session refreshed"));
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
