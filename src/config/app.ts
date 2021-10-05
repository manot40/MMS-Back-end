// App Settings
const appConfig = {
  listenPort: process.env.SVR_PORT || 6900,
  enableCluster: process.env.CLUSTER.toLowerCase() || "false",
  clusterThread: process.env.THREAD_LIMIT || "auto",
};
export default appConfig;
