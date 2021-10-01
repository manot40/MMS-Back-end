import { createUserHandler } from "../../controllers/user.controller";
import { Router } from "express";

// Middleware

// Schemas

// Controller
import { flushExpiredTokenHandler } from "../../controllers/auth.controller";

let router = Router();

router.post("/", createUserHandler);
router.delete("/session-flush", flushExpiredTokenHandler);

export default router;
