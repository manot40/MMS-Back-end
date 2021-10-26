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

let route = Router();

route.post("/", validateRequest(createItemSchema), createItemHandler);
route.post(
  "/batch",
  validateRequest(createManySchema),
  importItemsDataHandler
);
route.put("/:itemId", validateRequest(updateItemSchema), updateItemHandler);
route.delete("/:itemId", validateRequest(deleteItemSchema), deleteItemHandler);

export default route;
