// CORS Settings
let whiteList: Array<string> | string = process.env.CORS_WHITELIST.split(";");
if (!whiteList[0]) whiteList = "*";

const corsConfig = {
  origin: whiteList,
};

export default corsConfig;
