import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Warehouse, { WarehouseDocument } from "../models/warehouse.model";

export function createWarehouse(input: DocumentDefinition<WarehouseDocument>) {
  return Warehouse.create(input);
}

export async function checkIfWarehouseExist(
  query: FilterQuery<WarehouseDocument>
) {
  return await Warehouse.exists(query);
}

export function findWarehouse(
  query: FilterQuery<WarehouseDocument>,
  options: QueryOptions = { lean: true }
) {
  return Warehouse.findOne(query, options);
}

export function getWarehouses() {
  return Warehouse.find().populate([{ path: "user", select: "name" }]);
}

export function updateWarehouse(
  query: FilterQuery<WarehouseDocument>,
  update: UpdateQuery<WarehouseDocument>,
  options: QueryOptions
) {
  return Warehouse.findOneAndUpdate(query, update, options);
}

export function deleteWarehouse(query: FilterQuery<WarehouseDocument>) {
  return Warehouse.deleteOne(query);
}
