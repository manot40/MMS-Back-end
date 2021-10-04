import { Response, Request } from "express";
import regexp from "../helpers/escapeRegex";
import { get } from "lodash";
import msg from "../helpers/messenger";
import {
  createWarehouse,
  countWarehouses,
  updateWarehouse,
  findWarehouse,
  getWarehouses,
  deleteWarehouse,
} from "../services/warehouse.service";

export async function createWarehouseHandler(req: Request, res: Response) {
  const user = get(req, "user._id");
  const { body } = req;

  await createWarehouse({ ...body, user })
    .then((data) => {
      return res.status(200).send(msg(200, data));
    })
    .catch((err) => {
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function getWarehouseHandler(req: Request, res: Response) {
  const _id = req.params.warehouseId;

  await findWarehouse({ _id })
    .then((data) => {
      return res.status(200).send(msg(200, data));
    })
    .catch(() => {
      return res.status(404).send(msg(404, {}, "Warehouse not found"));
    });
}

export async function getWarehousesHandler(req: Request, res: Response) {
  const query = req.query;
  let filter = {};
  let options = {
    limit: 10,
    sort: { name: "asc" },
  };

  if (query.search) {
    const $regex = new RegExp(regexp(query.search as string), "i");
    filter = { ...filter, name: { $regex } };
  }
  if (query.limit) {
    // @ts-ignore
    options.limit = parseInt(query.limit);
  }
  if (query.page) {
    // @ts-ignore
    options = { ...options, skip: (parseInt(query.page) - 1) * options.limit };
  }
  if (query.sort) {
    // @ts-ignore
    options.sort = { [query.sort.toString()]: query.sortby || "asc" };
  }
  const count = await countWarehouses({ ...filter });

  await getWarehouses({ ...filter }, { ...options })
    .then((data) => {
      const response = msg(200, data);
      const totalPages = Math.ceil(count / options.limit);
      return res.status(200).send({ ...response, totalPages });
    })
    .catch((err) => {
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function updateWarehouseHandler(req: Request, res: Response) {
  const user = get(req, "user._id");
  const _id = get(req, "params.warehouseId");
  const update = { ...req.body, user };

  await findWarehouse({ _id }).catch(() => {
    return res.status(404).send(msg(404, {}, "Warehouse not found"));
  });

  await updateWarehouse({ _id }, update, { new: true })
    .then((data) => {
      return res.status(200).send(msg(200, data, "Updated successfuly"));
    })
    .catch((err) => {
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}

export async function deleteWarehouseHandler(req: Request, res: Response) {
  const _id = get(req, "params.warehouseId");

  await findWarehouse({ _id }).catch(() => {
    return res.status(404).send(msg(404, {}, "Warehouse not found"));
  });

  await deleteWarehouse({ _id })
    .then(() => {
      return res.status(200).send(msg(200, {}, "Deleted successfuly"));
    })
    .catch((err) => {
      return res.status(500).send(msg(500, err.errors, err._message));
    });
}
