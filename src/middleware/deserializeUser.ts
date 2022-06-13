import ms from "ms";
import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

import config from "../config/jwt";
import { decode } from "../helpers/jwt";
import { reIssueAccessToken } from "../services/auth.service";

const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    req.cookies.accessToken ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    req.cookies.refreshToken || get(req, "headers.refreshtoken", "");

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);

  if (decoded) {
    // @ts-ignore
    req.user = decoded;

    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);

    if (newAccessToken) {
      // Add the new access token to the response header
      if (req.cookies.accessToken) {
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: ms(config.accessTokenTTL),
          secure: process.env.NODE_ENV == "production",
        });
      } else {
        res.setHeader("x-access-token", newAccessToken);
      }

      const { decoded } = decode(newAccessToken);

      // @ts-ignore
      req.user = decoded;
    }

    return next();
  }

  return next();
};

export default validateJWT;
