import { getUserInformationHandler } from "../controllers/user.controller";
import { Router } from "express";

// Middleware and Helpers
import validateRequest from "../helpers/validateRequest";
import { requireAuth } from "../middleware";

// Schemas
import { createUserSchema } from "../schemas/user.schema";

// Controllers
import { createUserHandler } from "../controllers/user.controller";

let route = Router();

route.post(
  "/register",
  requireAuth("asAdmin"),
  validateRequest(createUserSchema),
  createUserHandler
);
route.get("/me", getUserInformationHandler);

export default route;
