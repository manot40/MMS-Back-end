// Dependencies
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import cluster from 'cluster';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { urlencoded, json } from 'express';

// Config and Helpers utility
import db from './db';
import morgan from './morgan';
import useRedis from './cache';
import log from '../helpers/pino';
import config from '../config/app';
import corsConfig from '../config/cors';

// Middleware
import router from '../routes';
import { deserializeUser } from '../middleware';

export default class Server {
  private app: express.Application;
  private server: http.Server;

  constructor() {
    cluster.isPrimary && log.info(`(Express) Main Process running in PID ${process.pid} with ${config.env} env`);
    config.enableCluster ? this.setupCluster() : this.setupApp();
  }

  private async setupApp() {
    await db.connect().then(useRedis);
    this.app = express();
    this.setupMiddleware();
    this.startServer();
  }

  public async startServer(): Promise<http.Server> {
    return new Promise((resolve) => {
      this.server = this.app.listen(config.listenPort, () => {
        cluster.isPrimary && log.info(`(Server) Ready: Listening on port ${config.listenPort}`);
        resolve(this.server);
      });
    });
  }
  public stopServer() {
    this.server.close(() => {
      log.info('(Server) Stopped');
    });
  }
  public restartServer() {
    log.info('(Server) Restarting...');
    this.server.close(() => {
      this.startServer();
    });
  }

  private setupMiddleware() {
    // Header Protection and Static Files
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(express.static('public'));
    this.app.use(cors(corsConfig));

    // Request Parser
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(json());

    // Logger
    this.app.use(morgan);

    // Custom Middleware
    this.app.use(deserializeUser);

    // ROUTES MUST AT THE END OF MIDDLEWARES
    this.app.use(router);
  }

  private setupCluster() {
    const thread = config.clusterThread;
    if (cluster.isPrimary) {
      log.info(`(Server) Cluster mode is active, ${thread} Threads in use.`);
      for (let i = 0; i < thread; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker: { process: { pid: any } }, code: number, signal: any) => {
        let cause;
        if (signal) cause = signal;
        if (code !== 0) cause = code;
        log.info(`(Server) Worker: ${worker.process.pid} died. Cause: ${cause}`);
        cluster.fork();
      });
    } else {
      this.setupApp();
    }
  }
}
