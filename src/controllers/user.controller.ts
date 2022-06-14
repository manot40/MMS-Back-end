import { Request, Response } from 'express';
import { get, omit } from 'lodash';
import { createUser, findUser } from '../services/user.service';
import log from '../helpers/pino';
import msg from '../helpers/messenger';

export async function createUserHandler(req: Request, res: Response) {
  await createUser(req.body)
    .then((data) => {
      const newUser = omit(data.toJSON(), 'password');
      return res.send(msg(200, newUser));
    })
    .catch((err) => {
      log.error(`(Database) ${err}`);
      return res.status(409).send(msg(409, {}, err.message));
    });
}

export async function getUserInformationHandler(req: Request, res: Response) {
  const { _id } = get(req, 'user');
  await findUser({ _id }, '-password')
    .cache({ key: `user-${_id}` })
    .then((data) => {
      return res.send(msg(200, data));
    })
    .catch((err) => {
      log.error(`(Database) ${err}`);
      return res.status(409).send(msg(409, null, err.message));
    });
}
