'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = process.env;

module.exports.makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET || `test`, {expiresIn: `200s`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET || `test`);
  return {accessToken, refreshToken};
};
