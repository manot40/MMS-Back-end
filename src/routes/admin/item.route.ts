import { Router } from "express";

// Middleware
import { validateRequest } from "../../middleware";

// Schemas
import {
  createItemSchema,
  updateItemSchema,
  deleteItemSchema,
  createManySchema,
} from "../../schemas/item.schema";

// Controllers
import {
  createItemHandler,
  updateItemHandler,
  deleteItemHandler,
  importItemsDataHandler,
} from "../../controllers/item.controller";

let router = Router();

router.post("/", validateRequest(createItemSchema), createItemHandler);
router.post(
  "/batch",
  validateRequest(createManySchema),
  importItemsDataHandler
);
router.put("/:itemId", validateRequest(updateItemSchema), updateItemHandler);
router.delete("/:itemId", validateRequest(deleteItemSchema), deleteItemHandler);

export default router;
