import { Request, Response } from "express";
import { get, omit } from "lodash";
import { createUser, findUser } from "../services/user.service";
import log from "../helpers/pino";
import msg from "../helpers/messenger";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    const created = omit(user.toJSON(), "password");
    return res.send(msg(200, created, null));
  } catch (err) {
    log.error(`(Database) ${err}`);
    return res.status(409).send(msg(409, null, err.message));
  }
}

export async function getUserInformationHandler(req: Request, res: Response) {
  try {
    const id = get(req, "user._id");
    const user = await findUser({ _id: id }, "-password");
    return res.send(msg(200, user, null));
  } catch (err) {
    log.error(`(Database) ${err}`);
    return res.status(409).send(msg(409, null, err.message));
  }
}
