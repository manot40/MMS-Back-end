import { Schema, Document, model } from "mongoose";
import { ItemDocument } from "./item.model";
import { UserDocument } from "./user.model";
import { WarehouseDocument } from "./warehouse.model";

export interface TransactionDocument extends Document {
  user: UserDocument["_id"];
  txId: string;
  description: String;
  warehouse: WarehouseDocument["_id"];
  txDate: Date;
  type: string;
  status: string;
  items: [
    {
      item: ItemDocument["_id"];
      quantity: number;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

const TransactionItemsSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const TransactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    txId: { type: String, unique: true },
    description: { type: String, required: true },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    txDate: { type: Date, required: true },
    type: { type: String, enum: ["in", "out"], default: "out" },
    status: {
      type: String,
      enum: ["draft", "posted", "closed"],
      default: "draft",
    },
    items: [TransactionItemsSchema],
  },
  { timestamps: true }
);

const Transaction = model<TransactionDocument>(
  "Transaction",
  TransactionSchema
);

export default Transaction;
