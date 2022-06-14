require('dotenv').config();
import { cpus } from 'os';
// App Settings
const appConfig = {
  env: process.env.NODE_ENV || 'development',
  listenPort: +process.env.PORT || +process.env.SVR_PORT || 6000,
  appHost: process.env.SVR_HOST || 'localhost',
  enableCluster: process.env.CLUSTER === 'true' || false,
  clusterThread: +process.env.THREAD_LIMIT || cpus().length,
};
export default appConfig;
