import { Router } from "express";

// Middleware

// Schemas

// Controllers
import {
  getWarehouseHandler,
  getWarehousesHandler,
} from "../controllers/warehouse.controller";

let router = Router();

router.get("/", getWarehousesHandler);
router.get("/:warehouseId", getWarehouseHandler);

export default router;
