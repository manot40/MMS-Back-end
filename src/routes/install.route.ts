import { importItemsFromExcel } from "../controllers/install.controller";
import { Router } from "express";
import multer from "multer";

// Script
const upload = multer();

// Schemas

// Controllers

let route = Router();

route.get("/", (req, res) => {
  res.sendStatus(200);
});

route.post("/import/items", upload.single("importFile"), importItemsFromExcel);

export default route;
