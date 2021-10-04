import { Schema, Document, model } from "mongoose";
import { UserDocument } from "./user.model";
import { WarehouseDocument } from "./warehouse.model";

export interface ItemDocument extends Document {
  user: UserDocument["_id"];
  name: string;
  sku: string;
  unit: string;
  type: string;
  buffer: number;
  warehouse: Array<WarehouseDocument["_id"]>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, unique: true },
    sku: { type: String },
    unit: {
      type: String,
      required: true,
      enum: ["PCS", "KG", "LTR", "BTL", "SET", "PSG", "MTR", "GLN"],
    },
    type: { type: String, required: true, enum: ["chemical", "consumable"] },
    bufferStock: { type: Number, default: 0 },
    warehouse: [{ type: Schema.Types.ObjectId, ref: "Warehouse", required: true }],
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Item = model<ItemDocument>("Item", itemSchema);

export default Item;
