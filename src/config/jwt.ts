require('dotenv').config();
// JWT Settings
const jwtConfig = {
  salt: (process.env.JWT_SALT_FACTOR as unknown) || 10,
  accessTokenTTL: process.env.JWT_ACCESSTOKEN_TTL || '15m',
  refreshTokenTTL: process.env.JWT_REFRESHTOKEN_TTL || '4w',
  privateKey: process.env.JWT_PRIVATE_KEY || "ssssst.... it's a secret",
};
export default jwtConfig;
