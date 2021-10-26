import { Router } from "express";
import { requireAuth } from "../middleware";

// Routes
import Default from "./public.route";
import Install from "./install.route";
import Auth from "./auth.route";
import Transaction from "./transaction.route";
import User from "./user.route";
import Item from "./item.route";
import Warehouse from "./warehouse.route";
import AdminUsers from "./admin/users.route";
import AdminItem from "./admin/item.route";
import AdminWarehouse from "./admin/warehouse.route";
import AdminTransaction from "./admin/transaction.route";

let router = Router();
const verifyUser = (role?: string) => new requireAuth(role).verify;

router.use("/", Default);
router.use("/install", Install);

// Standard user route
router.use("/auth", Auth);
router.use("/user", verifyUser(), User);
router.use("/item", verifyUser(), Item);
router.use("/warehouse", verifyUser(), Warehouse);
router.use("/transaction", verifyUser(), Transaction);

// Administrator route
router.use("/admin/users", verifyUser("asAdmin"), AdminUsers);
router.use("/admin/item", verifyUser("asAdmin"), AdminItem);
router.use("/admin/warehouse", verifyUser("asAdmin"), AdminWarehouse);
router.use("/admin/transaction", verifyUser("asAdmin"), AdminTransaction);

export default router;