import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { checkAdminRole } from "../services/user.service";
import msg from "../helpers/messenger";

export class requireAuth {
  public static user = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = get(req, "user");

    if (!user)
      return res.status(401).send(msg(401, {}, "You are not logged in"));

    return next();
  };

  public static admin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = get(req, "user");

    if (!user)
      return res.status(401).send(msg(401, {}, "You are not logged in"));
    if (!(await checkAdminRole(user._id)))
      return res.status(403).send(msg(403, {}, "Not enough permission"));
    return next();
  };
}

export default requireAuth;
