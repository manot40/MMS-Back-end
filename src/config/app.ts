require('dotenv').config();
import { cpus } from "os";
// App Settings
const appConfig = {
  listenPort: +process.env.SVR_PORT || 6000,
  appHost: process.env.SVR_HOST || "localhost:6000",
  enableCluster: process.env.CLUSTER === "true" || false,
  clusterThread: +process.env.THREAD_LIMIT || cpus().length,
};
export default appConfig;
