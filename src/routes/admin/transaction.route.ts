import { Router } from "express";

// Middleware

// Schemas

// Controllers
import {
  exportTransactionsHandler
} from "../../controllers/transaction.controller";

let router = Router();

router.get("/export", exportTransactionsHandler);

export default router;
