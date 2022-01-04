import { getUserInformationHandler } from "../controllers/user.controller";
import { Router } from "express";

// Middleware
import { validateRequest, requireAuth } from "../middleware";

// Schemas
import { createUserSchema } from "../schemas/user.schema";

// Controllers
import { createUserHandler } from "../controllers/user.controller";

let route = Router();

route.post(
  "/register",
  new requireAuth("asAdmin").verify,
  validateRequest(createUserSchema),
  createUserHandler
);
route.get("/me", getUserInformationHandler);

export default route;
