import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Item, { ItemDocument } from "../models/item.model";

export function createItem(input: DocumentDefinition<ItemDocument>) {
  return Item.create(input);
}

export function createManyItem(input: DocumentDefinition<ItemDocument>) {
  return Item.insertMany(input);
}

export function findItem(
  query: FilterQuery<ItemDocument>,
  options: QueryOptions = { lean: true }
) {
  return Item.findOne(query, null, options)
}

export function getItems(
  query: FilterQuery<ItemDocument>,
  options: QueryOptions = { lean: true },
) {
  return Item.find(query, null, options)
}

export function updateItem(
  query: FilterQuery<ItemDocument>,
  update: UpdateQuery<ItemDocument>,
  options: QueryOptions
) {
  return Item.findOneAndUpdate(query, update, options);
}

export function deleteItem(query: FilterQuery<ItemDocument>) {
  return Item.deleteOne(query);
}
