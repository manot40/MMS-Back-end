import { Router } from 'express';

// Middleware

// Schemas

// Controllers
import {
  createTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  getTransactionHandler,
  getTransactionsHandler,
  exportTransactionsHandler,
} from '../controllers/transaction.controller';

let route = Router();

route.get('/', getTransactionsHandler);
route.get('/export', exportTransactionsHandler);
route.get('/:trxId', getTransactionHandler);
route.post('/', createTransactionHandler);
route.put('/:trxId', updateTransactionHandler);
route.delete('/:trxId', deleteTransactionHandler);

export default route;
