import { Router } from "express";

// Middleware
import { validateRequest } from "../../middleware";

// Schemas
import {
  createWarehouseSchema,
  updateWarehouseSchema,
  deleteWarehouseSchema,
} from "../../schemas/warehouse.schema";

// Controllers
import {
  createWarehouseHandler,
  updateWarehouseHandler,
  deleteWarehouseHandler,
} from "../../controllers/warehouse.controller";

let router = Router();

router.post(
  "/",
  validateRequest(createWarehouseSchema),
  createWarehouseHandler
);
router.put(
  "/:warehouseId",
  validateRequest(updateWarehouseSchema),
  updateWarehouseHandler
);
router.delete(
  "/:warehouseId",
  validateRequest(deleteWarehouseSchema),
  deleteWarehouseHandler
);

export default router;
