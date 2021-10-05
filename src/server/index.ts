import cluster from "cluster";
import { cpus } from "os";
import express, { urlencoded, json } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";
import path from "path";
import serveIndex from "serve-index";
import compression from "compression";
const rfs = require("rotating-file-stream");

// Config and Helpers utility
import config from "../config/app";
import corsConfig from "../config/cors";
import log from "../helpers/pino";
import db from "./db";

// Middleware
import { validateJWT, requireAuth } from "../middleware";

// Routes
import {
  publicRoute,
  firstInstallRoute,
  authRoute,
  transactionRoute,
  userRoute,
  adminUsersRoute,
  itemRoute,
  adminItemRoute,
  warehouseRoute,
  adminWarehouseRoute,
  adminTransactionRoute,
} from "../routes";

export default class Server {
  private app: express.Application;
  private server: http.Server;

  constructor() {
    this.initProcess();
  }

  private initProcess() {
    if (config.enableCluster === "true") {
      let thread: number;
      if (
        config.clusterThread == "auto" ||
        parseInt(config.clusterThread) > cpus().length
      ) {
        thread = cpus().length;
      } else {
        thread = parseInt(config.clusterThread);
      }

      if (cluster.isMaster) {
        log.info(`(Server) Listening on port ${config.listenPort}`);
        log.info(`(Server) Cluster mode is active.`);
        log.info(
          `(Server) ${thread} Threads in use, with main process PID: ${process.pid}`
        );
        for (let i = 0; i < thread; i++) {
          cluster.fork();
        }
        cluster.on(
          "exit",
          (worker: { process: { pid: any } }, code: number, signal: any) => {
            let cause;
            if (signal) cause = signal;
            if (code !== 0) cause = code;
            log.info(
              `(Server) Worker: ${worker.process.pid} died. Cause: ${cause}`
            );
            cluster.fork();
          }
        );
      } else {
        this.initServer();
      }
    } else {
      this.initServer();
    }
  }

  private async initServer() {
    // Database Connection
    await db.connect();
    // Express
    this.app = express();
    // Middlewares
    this.configureDefaultMiddlewares();
    // Routes
    this.configureRoutes();
    // Start Server
    this.startServer();
  }

  public async startServer(): Promise<http.Server> {
    return new Promise((resolve) => {
      this.server = this.app.listen(
        process.env.PORT || config.listenPort,
        () => {
          cluster.isMaster &&
            log.info(`(Server) Listening on port ${config.listenPort}`);
          log.info(`(Server) Running in PID: ${process.pid}`);
          resolve(this.server);
        }
      );
    });
  }

  private configureDefaultMiddlewares() {
    const rootPath = path.join(process.cwd());
    const accessLogStream = rfs.createStream("access.log", {
      size: "2M",
      interval: "1d",
      path: "logs",
    });
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(cors(corsConfig));
    this.app.use(compression());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.app.use(validateJWT);
    this.app.use(express.static(rootPath + "/"));
    this.app.use("/public", serveIndex(rootPath + "/public"));
    this.app.use(
      morgan(
        ':status ":method :url" [:date[web]] ":user-agent"  :response-time ms',
        {
          stream: accessLogStream,
          skip(_req, res) {
            return res.statusCode < 405;
          },
        }
      )
    );
    // Terminal logger
    if (process.env.NODE_ENV === "dev") {
      this.app.use(morgan("dev"));
    }
  }

  private configureRoutes() {
    const verifyUser = (role?: string) => new requireAuth(role).verify;

    this.app.use("/", publicRoute);
    this.app.use("/install", firstInstallRoute);

    // Standard user route
    this.app.use("/auth", authRoute);
    this.app.use("/user", verifyUser(), userRoute);
    this.app.use("/item", verifyUser(), itemRoute);
    this.app.use("/warehouse", verifyUser(), warehouseRoute);
    this.app.use("/transaction", verifyUser(), transactionRoute);

    // Administrator route
    this.app.use("/admin/users", verifyUser("asAdmin"), adminUsersRoute);
    this.app.use("/admin/item", verifyUser("asAdmin"), adminItemRoute);
    this.app.use("/admin/warehouse", verifyUser("asAdmin"), adminWarehouseRoute);
    this.app.use("/admin/transaction", verifyUser("asAdmin"), adminTransactionRoute);
  }
}
