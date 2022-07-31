import mongoose from 'mongoose';
import Redis from 'ioredis';

import log from '../helpers/pino';

const redisURL = process.env.REDIS_URL;

let redis: Redis;

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options: CacheOptions = {}) {
  this.useCache = true;
  this.hashKey = options.key || 'default';
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache || !redisURL) {
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
  if (redisURL) {
    redis = new Redis(redisURL);

    redis.on('ready', () => {
      log.info(`(Redis) Connected to redis caching service`);
    });

    redis.on('close', () => {
      log.warn(`(Redis) Database connection closed!`);
    });
  }
}
