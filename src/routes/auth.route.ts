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

let router = Router();

router.post(
  "/register",
  new requireAuth("asAdmin").verify,
  validateRequest(createUserSchema),
  createUserHandler
);
router.post(
  "/login",
  validateRequest(createUserSessionSchema),
  createUserSessionHandler
);
router.post("/refresh", refreshAccessToken);
router.get("/session", getUserSessionHandler);

export default router;
