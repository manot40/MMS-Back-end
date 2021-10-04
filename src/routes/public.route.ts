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
  res
    .type("html")
    .setHeader(
      "Content-Security-Policy",
      "script-src 'self' https://unpkg.com https://cdn.jsdelivr.net data: blob: 'unsafe-eval' 'unsafe-inline'"
    )
    .sendFile("api.html", options);
});

export default router;
