// JWT Settings
const jwtConfig = {
  salt: process.env.JWT_SALT_FACTOR as unknown,
  accessTokenTTL: process.env.JWT_ACCESSTOKEN_TTL,
  refreshTokenTTL: process.env.JWT_REFRESHTOKEN_TTL,
  privateKey: process.env.JWT_PRIVATE_KEY,
};
export default jwtConfig;
