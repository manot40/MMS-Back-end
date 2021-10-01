import { Response, Request } from "express";
import { get } from "lodash";
import msg from "../helpers/messenger";
import {
  createWarehouse,
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
  const param = get(req, "params.warehouseId");

  await findWarehouse({ _id: param })
    .then((data) => {
      return res.status(200).send(msg(200, data));
    })
    .catch(() => {
      return res.status(404).send(msg(404, {}, "Warehouse not found"));
    });
}

export async function getWarehousesHandler(_req: Request, res: Response) {
  await getWarehouses()
    .then((data) => {
      return res.status(200).send(msg(200, data));
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
