import { getUserInformationHandler } from "../controllers/user.controller";
import { Router } from "express";
import { invalidateUserSessionHandler } from "../controllers/auth.controller";

// Middleware

// Schemas

// Controllers

let router = Router();

router.get("/me", getUserInformationHandler);
router.delete("/logout", invalidateUserSessionHandler);

export default router;
