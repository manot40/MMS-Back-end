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
    .setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval' https://unpkg.com 'unsafe-inline'")
    .sendFile("api.html", options);
});

router.get("/spec.yml", (_req, res) => {
  res.type("text/yaml").sendFile("spec.yml", options);
});

export default router;
