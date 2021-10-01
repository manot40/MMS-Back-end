// External dependencies
const cluster = require("cluster");
const totalCpuThread = require("os").cpus().length;
var rfs = require("rotating-file-stream");
import express, { urlencoded, json } from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import http from "http";

// Custom scripts and helpers
import config from "../config/app";
import corsConfig from "../config/cors";
import log from "../helpers/pino";
import db from "./db";
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
    this.initExpress();
  }

  private initExpress() {
    if (config.enableCluster) {
      let thread: number;
      if (
        config.clusterThread == "auto" ||
        parseInt(config.clusterThread) > totalCpuThread
      ) {
        thread = totalCpuThread;
      } else {
        thread = parseInt(config.clusterThread);
      }

      if (cluster.isMaster) {
        log.info(`(Server) Cluster mode is active.`);
        log.info(`(Server) Listening on port ${config.listenPort}`);
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
        this.callExpress();
      }
    } else {
      this.callExpress();
    }
  }

  private async callExpress() {
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
          cluster.isMaster
            ? log.info(`(Server) Listening on port ${config.listenPort}`)
            : null;
          log.info(`(Server) Running in PID: ${process.pid}`);
          resolve(this.server);
        }
      );
    });
  }

  private configureDefaultMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors(corsConfig));
    this.app.use(compression());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(json());
    this.app.use(validateJWT);
    const accessLogStream = rfs.createStream("access.log", {
      size: "2M",
      interval: "1d",
      path: "logs",
    });
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
    this.app.use("/", publicRoute);
    this.app.use("/install", firstInstallRoute);

    // Standard user route
    this.app.use("/auth", authRoute);
    this.app.use("/user", requireAuth.user, userRoute);
    this.app.use("/item", requireAuth.user, itemRoute);
    this.app.use("/warehouse", requireAuth.user, warehouseRoute);
    this.app.use("/transaction", requireAuth.user, transactionRoute);

    // Administrator route
    this.app.use("/admin/users", requireAuth.admin, adminUsersRoute);
    this.app.use("/admin/item", requireAuth.admin, adminItemRoute);
    this.app.use("/admin/warehouse", requireAuth.admin, adminWarehouseRoute);
    this.app.use(
      "/admin/transaction",
      requireAuth.admin,
      adminTransactionRoute
    );
  }
}
