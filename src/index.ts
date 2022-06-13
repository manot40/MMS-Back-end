import log from './helpers/pino';
import Server from './libs/app';

const app = new Server();

process.on('uncaughtException', (err: Error) => {
  log.error('Uncaught Exception | ' + err.message);
});

process.on('unhandledRejection', (err: Error) => {
  log.error('Unhandled Promise Rejection | ' + err);
});

export default app;
