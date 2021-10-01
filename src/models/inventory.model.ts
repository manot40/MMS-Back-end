import { Schema, Document, model } from "mongoose";
import dayjs from "dayjs";
import { TransactionDocument } from "./transaction.model";
import { ItemDocument } from "./item.model";
import { WarehouseDocument } from "./warehouse.model";

export interface InventoryDocument extends Document {
  inventoryPeriod: Date;
  warehouse: WarehouseDocument["_id"];
  transactions: Array<TransactionDocument["_id"]>;
  onHandItem: [
    {
      item: ItemDocument["_id"],
      initQty: number,
      currQty: number,
      closeQty: number,
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item" },
    initQty: { type: Number, default: 0 },
    currQty: { type: Number, default: 0 },
    closeQty: { type: Number, default: 0 },
  },
  { _id: false }
);

const InventorySchema = new Schema(
  {
    inventoryPeriod: { type: Date, default: dayjs().endOf("month") },
    warehouse: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    onHandItem: [ItemSchema],
  },
  { timestamps: true }
);

const Inventory = model<InventoryDocument>("Inventory", InventorySchema);

export default Inventory;
