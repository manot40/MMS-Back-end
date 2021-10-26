import { Router } from "express";

// Middleware

// Schemas

// Controllers
import {
  exportTransactionsHandler
} from "../../controllers/transaction.controller";

let route = Router();

route.get("/export", exportTransactionsHandler);

export default route;
