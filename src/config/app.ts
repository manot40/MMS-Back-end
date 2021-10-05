// App Settings
const appConfig = {
  listenPort: process.env.SVR_PORT || 6900,
  enableCluster: process.env.CLUSTER,
  clusterThread: process.env.THREAD_LIMIT,
};
export default appConfig;
