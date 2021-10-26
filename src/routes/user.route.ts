import { getUserInformationHandler } from "../controllers/user.controller";
import { Router } from "express";
import { invalidateUserSessionHandler } from "../controllers/auth.controller";

// Middleware

// Schemas

// Controllers

let route = Router();

route.get("/me", getUserInformationHandler);
route.delete("/logout", invalidateUserSessionHandler);

export default route;
