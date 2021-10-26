import { Router } from "express";

// Middleware
import { validateRequest, requireAuth } from "../middleware";

// Schemas
import { createUserSchema } from "../schemas/user.schema";
import { createUserSessionSchema } from "../schemas/session.schema";

// Controllers
import { createUserHandler } from "../controllers/user.controller";

import {
  createUserSessionHandler,
  getUserSessionHandler,
  refreshAccessToken,
} from "../controllers/auth.controller";

let route = Router();

route.post(
  "/register",
  new requireAuth("asAdmin").verify,
  validateRequest(createUserSchema),
  createUserHandler
);
route.post(
  "/login",
  validateRequest(createUserSessionSchema),
  createUserSessionHandler
);
route.post("/refresh", refreshAccessToken);
route.get("/session", getUserSessionHandler);

export default route;
