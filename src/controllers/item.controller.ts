import { Response, Request } from "express";
import regexp from "../helpers/escapeRegex";
import { get } from "lodash";
import msg from "../helpers/messenger";
import {
  createItem,
  updateItem,
  findItem,
  getItems,
  countItems,
  deleteItem,
  createManyItem,
} from "../services/item.service";

export async function createItemHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
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
  const userId = get(req, "user._id");
  const body = req.body.items;
  await body.forEach((el: any) => {
    el.user = userId;
  });

  await createManyItem(body)
    .then((data) => {
      return res.status(200).send(msg(200, data, "Data imported successfully"));
    })
    .catch((err) => {
      return res.status(400).send(msg(400, err));
    });
}

export async function getItemHandler(req: Request, res: Response) {
  let options: any = {
    populate: [
      { path: "user", select: "name" },
      { path: "warehouse", select: "name" },
    ],
  };
  let filter = { _id: get(req, "params.itemId") };

  await findItem({ ...filter }, { ...options })
    .then((resp) => {
      return res.status(200).send(msg(200, resp));
    })
    .catch((err) => {
      return res.status(404).send(msg(404, {}, err));
    });
}

export async function getItemsHandler(req: Request, res: Response) {
  const query = req.query;
  let options: any = {
    populate: [
      { path: "user", select: "name" },
      { path: "warehouse", select: "name" },
    ],
    sort: { name: "asc" },
    limit: 10,
  };
  let filter = {};

  if (query.warehouse) {
    filter = { ...filter, warehouse: query.warehouse };
    options = { ...options, projection: "_id name unit" };
    if (!query.limit) delete options.limit;
    delete options.populate;
  }
  if (query.search) {
    const $regex = new RegExp(regexp(query.search as string), "i");
    filter = { ...filter, name: { $regex } };
  }
  if (query.limit) {
    // @ts-ignore
    options.limit = parseInt(query.limit);
  }
  if (query.page) {
    options.limit &&= options = {
      ...options,
      // @ts-ignore
      skip: (parseInt(query.page) - 1) * options.limit,
    };
  }
  if (query.sort) {
    // @ts-ignore
    options.sort = { [query.sort.toString()]: query.sortby || "asc" };
  }
  const count = await countItems({ ...filter }).catch(() => 0);

  await getItems({ ...filter }, { ...options })
    .then((data) => {
      const response = msg(200, data);
      const totalPages = options.limit ? Math.ceil(count / options.limit) : 1;
      return res.status(200).send({ ...response, totalPages });
    })
    .catch((err) => {
      return res.status(500).send(msg(500, { ...err }, err.message));
    });
}

export async function updateItemHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");
  const param = get(req, "params.itemId");
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
  const param = get(req, "params.itemId");

  const item = await findItem({ _id: param });

  if (!item) {
    return res.sendStatus(404);
  }

  await deleteItem({ _id: param });

  return res.sendStatus(200);
}
