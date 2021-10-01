import { Response, Request } from "express";
import { get } from "lodash";
import msg from "../helpers/messenger";
import {
  createItem,
  updateItem,
  findItem,
  getItems,
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
  let options: any = {
    populate: [
      { path: "user", select: "name" },
      { path: "warehouse", select: "name" },
    ],
    sort: { name: 1 },
  };
  let filter = {};
  const { warehouse } = get(req, "query");

  if (warehouse) {
    filter = { ...filter, warehouse: warehouse };
    options = { ...options, projection: { warehouse: 0 } };
  }
  await getItems({ ...filter }, { ...options })
    .then((resp) => {
      if (!resp.length)
        return res.status(404).send(msg(200, {}, "Item not found"));
      return res.status(200).send(msg(200, resp));
    })
    .catch((err) => {
      return res.status(500).send(msg(500, {}, err));
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
