require("dotenv").config();
import log from "./helpers/pino";
import Server from "./server";

new Server();

process.on("uncaughtException", (err: Error) => {
  log.error("Uncaught Exception | " + err.message);
});

process.on("unhandledRejection", (err: Error) => {
  log.error("Unhandled Promise Rejection | " + err);
});

module.exports = Server;
