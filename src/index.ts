import config from './config/app';
import log from './helpers/pino';
import Server from './libs/app';

const app = new Server();

process.on('uncaughtException', (err: Error) => {
  config.env === 'development' ? console.error(err) : log.error('Uncaught Exception | ' + err);
});

process.on('unhandledRejection', (err: Error) => {
  config.env === 'development' ? console.error(err) : log.error('Unhandled Promise Rejection | ' + err);
});

export default app;
