import serveIndex from "serve-index";
import { Router } from "express";
import path from "path";

// Script
const options = {
  root: path.join(process.cwd()),
};

// Schemas

// Controllers

let route = Router();
const rootPath = path.join(process.cwd());

route.use("/public", serveIndex(rootPath + "/public"));
route.get("/", (_req, res) => {
  res.type("html").sendFile("api.html", options);
});

export default route;
