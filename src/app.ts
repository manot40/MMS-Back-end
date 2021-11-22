import log from "./helpers/pino";
import chokidar from "chokidar";
import Server from "./server";

const watcher = chokidar.watch(".");
const app = new Server();

if (process.env.NODE_ENV === "production") {
  watcher.on("ready", () => {
    watcher.on("change", () => {
      Object.keys(require.cache).forEach((id) => {
        delete require.cache[id];
      });
      setTimeout(() => app.restartServer(), 1000);
    });
  });
}

process.on("uncaughtException", (err: Error) => {
  log.error("Uncaught Exception | " + err.message);
});

process.on("unhandledRejection", (err: Error) => {
  log.error("Unhandled Promise Rejection | " + err);
});

export default app;
