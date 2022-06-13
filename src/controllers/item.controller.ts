import { Response, Request } from 'express';
import queryHandler from '../helpers/queryHandler';
import { get } from 'lodash';
import msg from '../helpers/messenger';
import {
  createItem,
  updateItem,
  findItem,
  getItems,
  countItems,
  deleteItem,
  createManyItem,
} from '../services/item.service';
import { QueryOptions } from 'mongoose';

export async function createItemHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');
  const body = req.body;

  await createItem({ ...body, user: userId })
    .then((data) => {
      return res.status(200).send(msg(200, data));
    })
    .catch((err) => {
      return res.status(400).send(msg(400, err.errors, err._message));
    });
}

export async function importItemsDataHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');
  const body = req.body.items;
  await body.forEach((el: any) => {
    el.user = userId;
  });

  await createManyItem(body)
    .then((data) => {
      return res.status(200).send(msg(200, data, 'Data imported successfully'));
    })
    .catch((err) => {
      return res.status(400).send(msg(400, err));
    });
}

export async function getItemHandler(req: Request, res: Response) {
  let options: QueryOptions = {
    populate: [
      { path: 'user', select: 'name' },
      { path: 'warehouse', select: 'name' },
    ],
  };
  let filter = { _id: get(req, 'params.itemId') };

  await findItem({ ...filter }, { ...options })
    .then((resp) => {
      return res.status(200).send(msg(200, resp));
    })
    .catch((err) => {
      return res.status(404).send(msg(404, {}, err));
    });
}

export async function getItemsHandler(req: Request, res: Response) {
  let { options, filter } = queryHandler({
    populate: [
      { path: 'user', select: 'name' },
      { path: 'warehouse', select: 'name' },
    ],
    sort: { name: 'asc' },
    limit: 10,
    ...req.query,
  });
  if (req.query.warehouse) {
    filter = { ...filter, warehouse: req.query.warehouse };
    options = { ...options, projection: '_id name unit' };
    if (!req.query.limit) delete options.limit;
    delete options.populate;
  }

  const itemCount = await countItems({ ...filter }).catch(() => 0);
  await getItems({ ...filter }, { ...options })
    .then((data) => {
      const response = msg(200, data);
      const totalPages = options.limit ? Math.ceil(itemCount / options.limit) : 1;
      return res.status(200).send({ ...response, itemCount, totalPages });
    })
    .catch((err) => {
      return res.status(500).send(msg(500, { ...err }, err.message));
    });
}

export async function updateItemHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');
  const param = get(req, 'params.itemId');
  const update = Object.assign(req.body, { user: userId });

  const item = await findItem({ _id: param });

  if (!item) {
    return res.sendStatus(404);
  }

  await updateItem({ _id: param }, update, { new: true })
    .then((item) => {
      return res.status(200).send(msg(200, item));
    })
    .catch((err) => {
      return res.status(400).send(msg(400, err));
    });
}

export async function deleteItemHandler(req: Request, res: Response) {
  const param = get(req, 'params.itemId');

  const item = await findItem({ _id: param });

  if (!item) {
    return res.sendStatus(404);
  }

  await deleteItem({ _id: param });

  return res.sendStatus(200);
}
