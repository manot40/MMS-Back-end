require('dotenv').config();
// Cache Settings
const cacheConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: +process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};
export default cacheConfig;
