import { connect, connection } from "mongoose";
import log from "../helpers/pino";
import config from "../config/database";

export default class db {
  public static async connect() {
    return connect(
      `mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`
    ).catch((err) => {
      log.error("(Database) Failed to create connection.", err.message);
      log.warn("(Database) Please check your configuration.");
      process.exit(1);
    });
  }
  public static async close() {
    return connection.close(true).then(() => {
      log.info("(Database) Connection closed properly.");
    });
  }
}
