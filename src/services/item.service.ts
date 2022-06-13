import { SchemaDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import Item, { ItemDocument } from '../models/item.model';

export function createItem(input: SchemaDefinition<ItemDocument>) {
  return Item.create(input);
}

export function countItems(query?: FilterQuery<ItemDocument>) {
  return Item.countDocuments(query);
}

export function createManyItem(input: SchemaDefinition<ItemDocument>) {
  return Item.insertMany(input);
}

export function findItem(query: FilterQuery<ItemDocument>, options: QueryOptions = { lean: true }, projection: any = null) {
  return Item.findOne(query, projection, options);
}

export function getItems(query: FilterQuery<ItemDocument> = {}, options: QueryOptions = { lean: true }, projection: any = null) {
  return Item.find(query, projection, options);
}

export function updateItem(query: FilterQuery<ItemDocument>, update: UpdateQuery<ItemDocument>, options: QueryOptions) {
  return Item.findOneAndUpdate(query, update, options);
}

export function deleteItem(query: FilterQuery<ItemDocument>) {
  return Item.deleteOne(query);
}
