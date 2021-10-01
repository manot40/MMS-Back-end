import { Response, Request } from "express";
import { get } from "lodash";
import msg from "../helpers/messenger";
import { TransactionDocument } from "../models/transaction.model";
import { updateTransaction } from "../services/transaction.service";
import { updateWarehouse } from "../services/warehouse.service";
import {
  createInventory,
  updateInventory,
  findInventory,
  getInventories,
  deleteInventory,
  checkIfInvExist,
} from "../services/inventory.service";

function getInventoryDataFromArray(
  arr1: TransactionDocument["items"],
  arr2: TransactionDocument["items"],
  inverse: boolean
) {
  return arr1.filter((el1) => {
    if (inverse)
      return !arr2.some((el2) => {
        return el2.item.toString() === el1.item;
      });
    if (!inverse)
      return arr2.some((el2) => {
        return el2.item.toString() === el1.item;
      });
  });
}

// const updatedInventory = await findInventory({ _id: param })
//     .then(async (query) => {
//       const newItems = getInvDataFromArray(
//         body.transactions,
//         query.items,
//         true
//       );
//       const deletedItems = getInvDataFromArray(
//         query.items,
//         body.transactions,
//         true
//       );
//       const existingItems = getInvDataFromArray(
//         body.transactions,
//         query.items,
//         false
//       );

//       // Update entry header
//       await updateTransaction({ param }, omit(body, 'items'), { new: true });
//       if (!existingItems.length && !deletedItems.length && !newItems)
//         return res.status(200).send(msg(200, null, 'Update header data berhasil'));

//       // Add new transaction item if had any
//       if (newItems.length) {
//         for (let index of deletedItems) {
//           await updateTransaction(
//             { _id: param },
//             { $addToSet: { items: index } },
//             { new: true }
//           ).catch((err) => {
//             console.log(err);
//             return res
//               .status(500)
//               .send(
//                 msg(
//                   500,
//                   null,
//                   "Server cannot handling this request at this moment"
//                 )
//               );
//           });
//         }
//       }

//       // Delete transaction item if specified any
//       if (deletedItems.length) {
//         for (let index of deletedItems) {
//           await updateTransaction(
//             { _id: param },
//             { $pull: { items: { item: index.item } } },
//             { new: true }
//           ).catch((err) => {
//             console.log(err);
//             return res.status(500).send(msg(500, null));
//           });
//         }
//       }

//       // Now.. update the existing data
//       if (!existingItems.length) {
//         for (let index of existingItems) {
//           await updateTransaction(
//             { _id: param, "items.item": index.item },
//             { $set: { "items.$.quantity": index.quantity } },
//             { new: true }
//           ).catch((err) => {
//             console.log(err);
//             return res.status(500).send(msg(500, null));
//           });
//         }
//       }
//       return true;
//     })
//     .catch((err) => {
//       console.log(err);
//       return false;
//     });
