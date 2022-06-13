import { SchemaDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import Transaction, { TransactionDocument } from '../models/transaction.model';

export function createTransaction(input: SchemaDefinition<TransactionDocument>) {
  return Transaction.create(input);
}

export async function checkIfTrxExist(query: FilterQuery<TransactionDocument>) {
  return await Transaction.exists(query);
}

export function countTransactions(query?: FilterQuery<TransactionDocument>) {
  return Transaction.countDocuments(query);
}

export function findTransaction(query: FilterQuery<TransactionDocument>, options: QueryOptions = { lean: true }) {
  return Transaction.findOne(query, options).populate({
    path: 'user',
    select: 'name',
  });
}

export function getTransactions(query: FilterQuery<TransactionDocument> = {}, options: QueryOptions = { lean: true }, projection: any = null) {
  return Transaction.find(query, projection, options);
}

export function updateTransaction(query: FilterQuery<TransactionDocument>, update: UpdateQuery<TransactionDocument>, options: QueryOptions) {
  return Transaction.findOneAndUpdate(query, update, options);
}

export function deleteTransaction(query: FilterQuery<TransactionDocument>) {
  return Transaction.deleteOne(query);
}
