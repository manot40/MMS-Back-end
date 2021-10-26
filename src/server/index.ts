// Dependencies
import cors from "cors";
import http from "http";
import path from "path";
import helmet from "helmet";
import cluster from "cluster";
import compression from "compression";
import express, { urlencoded, json } from "express";

// Config and Helpers utility
import db from "./db";
import log from "../helpers/pino";
import config from "../config/app";
import corsConfig from "../config/cors";

// Middleware
import router from "../routes";
import { validateJWT } from "../middleware";

export default class Server {
  private app: express.Application;
  private server: http.Server;

  constructor() {
    config.enableCluster ? this.setupCluster() : this.setupServer();
  }

  public async startServer(): Promise<http.Server> {
    return new Promise((resolve) => {
      this.server = this.app.listen(
        process.env.PORT || config.listenPort,
        () => {
          cluster.isMaster &&
            log.info(`(Server) Listen port on ${config.listenPort}`);
          log.info(`(Server) Process running in PID: ${process.pid}`);
          resolve(this.server);
        }
      );
    });
  }

  private async setupServer() {
    await db.connect();
    this.app = express();
    this.setupMiddleware();
    this.startServer();
  }

  private setupMiddleware() {
    const rootPath = path.join(process.cwd());
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(express.static(rootPath + "/"));
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cors(corsConfig));
    this.app.use(compression());
    this.app.use(validateJWT);
    this.app.use(json());
    this.app.use(router);
  }

  private setupCluster() {
    const thread = config.clusterThread;
    if (cluster.isMaster) {
      log.info(`(Server) Cluster mode is active.`);
      log.info(
        `(Server) ${thread} Threads in use. Main process PID: ${process.pid}`
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
      this.setupServer();
    }
  }
}
