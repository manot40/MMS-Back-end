import mongoose from 'mongoose';
import log from '../helpers/pino';
import config from '../config/database';

const credStr = !config.dbUsername || !config.dbPassword ? '' : `${config.dbUsername}:${config.dbPassword}@`;

const dbUrl = `mongodb://${credStr}${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`;

export default class db {
  private static isGracefullyStopped: boolean;
  private static isStoppedUnexpectedly: boolean;

  private static watch() {
    mongoose.connection.on('disconnected', () => {
      if (!this.isGracefullyStopped) {
        log.warn('(Database) Disconnected from database unexpectedly');
        log.info('(Database) Trying to reconnect to MongoDB...');
        this.isStoppedUnexpectedly = true;
        db.connect();
      }
    });

    mongoose.connection.on('open', () => {
      this.isGracefullyStopped = false;
      this.isStoppedUnexpectedly = undefined;
      log.info(`(MongoDB) Connected to ${config.dbHost}`);
    });
  }

  public static async connect() {
    typeof this.isStoppedUnexpectedly == 'undefined' && this.watch();

    return mongoose.connect(dbUrl).catch((err) => {
      log.error('(MongoDB) Failed to create connection ' + err);
    });
  }

  public static async close() {
    return mongoose.connection.close(true).then(() => {
      this.isGracefullyStopped = true;
      log.info('(Database) Connection closed properly.');
    });
  }
}
