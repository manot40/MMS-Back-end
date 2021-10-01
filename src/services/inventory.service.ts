import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Inventory, { InventoryDocument } from "../models/inventory.model";

export function createInventory(input: DocumentDefinition<InventoryDocument>) {
  return Inventory.create(input);
}

export async function checkIfInvExist(query: FilterQuery<InventoryDocument>) {
  return await Inventory.exists(query);
}

export function findInventory(
  query: FilterQuery<InventoryDocument>,
  options: QueryOptions = { lean: true }
) {
  return Inventory.findOne(query, options);
}

export function getInventories() {
  return Inventory.find();
}

export function updateInventory(
  query: FilterQuery<InventoryDocument>,
  update: UpdateQuery<InventoryDocument>,
  options: QueryOptions
) {
  return Inventory.findOneAndUpdate(query, update, options);
}

export function deleteInventory(query: FilterQuery<InventoryDocument>) {
  return Inventory.deleteOne(query);
}
