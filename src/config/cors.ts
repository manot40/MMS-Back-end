require('dotenv').config();
// CORS Settings
let whiteList: Array<string> | string = process.env.CORS_WHITELIST.split(';');
if (!whiteList[0]) whiteList = '*';

const corsConfig = {
  origin: whiteList,
  credentials: true,
};

export default corsConfig;
