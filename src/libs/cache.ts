import mongoose from 'mongoose';
import Redis from 'ioredis';

import config from '../config/cache';
import log from '../helpers/pino';

let redis: Redis;

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options: CacheOptions = {}) {
  this.useCache = true;
  this.hashKey = options.key || 'default';
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache || !config.host) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const cached = await redis.hget(this.hashKey, key);

  if (cached) {
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed.map((doc) => new this.model(doc)) : new this.model(parsed);
  }

  const result = await exec.apply(this, arguments);

  redis.hmset(this.hashKey, { [key]: JSON.stringify(result), EX: 300 });

  return result;
};

export function clearCache(key: string, callback?: () => void) {
  if (/\*/.test(key)) {
    redis.keys(key, (err, rows) => {
      if (err) throw err;
      redis.del(...rows);
      callback && callback();
    });
  } else redis.del(key);
}

export default function useRedis() {
  if (config.host) {
    redis = new Redis({
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
    });

    redis.on('ready', () => {
      log.info(`(Redis) Connected to ${config.host}`);
    });

    redis.on('close', () => {
      log.warn(`(Redis) Database connection closed!`);
    });
  }
}
