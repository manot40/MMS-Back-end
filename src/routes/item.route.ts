import { Router } from "express";

// Middleware

// Schemas

// Controllers
import {
  getItemHandler,
  getItemsHandler,
} from "../controllers/item.controller";

let route = Router();

route.get("/", getItemsHandler);
route.get("/:itemId", getItemHandler);

export default route;
