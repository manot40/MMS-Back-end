import config from "../config/app";
import { Router } from "express";

// Scripts

// Schemas

// Controllers

let route = Router();

route.get("/", (_req, res) => {
  res.type("html").send(
    Buffer.from(
      `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>API Docs | MR Management System</title>
            <!-- Embed elements Elements via Web Component -->
            <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
            <link
              rel="stylesheet"
              href="https://unpkg.com/@stoplight/elements/styles.min.css"
            />
          </head>
          <body style="height: 100vh">
            <elements-api apiDescriptionUrl="/spec.yml" router="hash" layout="sidebar" />
          </body>
        </html>
      `
    )
  );
});

export default route;
