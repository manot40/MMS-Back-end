import { Router } from "express";

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
} from "../controllers/transaction.controller";

let router = Router();

router.get("/", getTransactionsHandler);
router.get("/export", exportTransactionsHandler);
router.get("/:trxId", getTransactionHandler);
router.post("/", createTransactionHandler);
router.put("/:trxId", updateTransactionHandler);
router.delete("/:trxId", deleteTransactionHandler);

export default router;
