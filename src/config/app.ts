// App Settings
const appConfig = {
  listenPort: process.env.SVR_PORT,
  enableCluster: process.env.CLUSTER,
  clusterThread: process.env.THREAD_LIMIT,
};
export default appConfig;
