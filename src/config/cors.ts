// CORS Settings
const corsConfig = {
  origin: process.env.CORS_WHITELIST.split(";") || "*",
};
export default corsConfig;
