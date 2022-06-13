import mongoose from "mongoose";
import log from "../helpers/pino";
import config from "../config/database";

export default class db {
  public static async connect() {
    return mongoose.connect(
      `mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`
    )
      .then(() => log.info(`(MongoDB) Connected to ${config.dbHost}`))
      .catch((err) => {
        log.error("(MongoDB) Failed to create connection " + err);
        log.warn("(MongoDB) Please check your configuration");
        process.exit(1);
      });
  }
  public static async close() {
    return mongoose.connection.close(true).then(() => {
      log.info("(Database) Connection closed properly.");
    });
  }
}
