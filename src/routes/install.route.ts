import { importItemsFromExcel } from "../controllers/install.controller";
import { Router } from "express";
import multer from "multer";

// Script
const upload = multer();

// Schemas

// Controllers

let router = Router();

router.get("/", (req, res) => {
  res.sendStatus(200);
});

router.post("/import/items", upload.single("importFile"), importItemsFromExcel);

export default router;
