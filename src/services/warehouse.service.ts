import { SchemaDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import Warehouse, { WarehouseDocument } from '../models/warehouse.model';

export function createWarehouse(input: SchemaDefinition<WarehouseDocument>) {
  return Warehouse.create(input);
}

export function countWarehouses(query?: FilterQuery<WarehouseDocument>) {
  return Warehouse.countDocuments(query);
}

export async function checkIfWarehouseExist(query: FilterQuery<WarehouseDocument>) {
  return await Warehouse.exists(query);
}

export function findWarehouse(query: FilterQuery<WarehouseDocument>, options: QueryOptions = { lean: true }, projection: any = null) {
  return Warehouse.findOne(query, projection, options);
}

export function getWarehouses(query: FilterQuery<WarehouseDocument> = {}, options: QueryOptions = { lean: true }, projection: any = null) {
  return Warehouse.find(query, projection, options).populate([{ path: 'user', select: 'name' }]);
}

export function updateWarehouse(query: FilterQuery<WarehouseDocument>, update: UpdateQuery<WarehouseDocument>, options: QueryOptions) {
  return Warehouse.findOneAndUpdate(query, update, options);
}

export function deleteWarehouse(query: FilterQuery<WarehouseDocument>) {
  return Warehouse.deleteOne(query);
}
