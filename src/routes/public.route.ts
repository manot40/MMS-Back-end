import { Router } from "express";
import path from "path";

// Script
const options = {
  root: path.join(process.cwd()),
};

// Schemas

// Controllers

let router = Router();

router.get("/", (_req, res) => {
  res.type("html").sendFile("api.html", options);
});

export default router;
