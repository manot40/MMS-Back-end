import log from "./helpers/pino";
import Server from "./server";

const app = new Server().startServer();
// Object.keys(require.cache).forEach((id) => {
//   delete require.cache[id];
// });

process.on("uncaughtException", (err: Error) => {
  log.error("Uncaught Exception | " + err.message);
});

process.on("unhandledRejection", (err: Error) => {
  log.error("Unhandled Promise Rejection | " + err);
});

export default app;
