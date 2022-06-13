import { Schema, Document, model } from 'mongoose';
import { ItemDocument } from './item.model';
import { UserDocument } from './user.model';
import { TransactionDocument } from './transaction.model';
import { WarehouseDocument } from './warehouse.model';

export interface OrderDocument extends Document {
  user: UserDocument['_id'];
  orderId: string;
  description: String;
  warehouse: WarehouseDocument['_id'];
  orderDate: Date;
  status: string;
  items: [
    {
      item: ItemDocument['_id'];
      orderQty: number;
      receivedQty: number;
    }
  ];
  trxRelation: Array<TransactionDocument['_id']>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemsSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    orderQty: { type: Number, required: true },
    receivedQty: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: String, unique: true },
    description: { type: String, required: true },
    warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
    orderDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['open', 'complete', 'close'],
      default: 'open',
    },
    items: [OrderItemsSchema],
    trxRelation: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  },
  { timestamps: true }
);

const Order = model<OrderDocument>('Order', OrderSchema);

export default Order;
