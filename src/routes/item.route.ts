import { Router } from "express";

// Middleware

// Schemas

// Controllers
import {
  getItemHandler,
  getItemsHandler,
} from "../controllers/item.controller";

let router = Router();

router.get("/", getItemsHandler);
router.get("/:itemId", getItemHandler);

export default router;
