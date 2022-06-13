import { Schema, Document, model } from 'mongoose';
import dayjs from 'dayjs';
import { ItemDocument } from './item.model';
import { UserDocument } from './user.model';

export interface WarehouseDocument extends Document {
  user: UserDocument['_id'];
  name: string;
  address: string;
  enabled: boolean;
  currPeriod: String;
  items: Array<ItemDocument['_id']>;
  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    currPeriod: {
      type: String,
      required: true,
      default: dayjs().endOf('month').format('MMMM YYYY'),
    },
  },
  { timestamps: true }
);

const Warehouse = model<WarehouseDocument>('Warehouse', WarehouseSchema);

export default Warehouse;
