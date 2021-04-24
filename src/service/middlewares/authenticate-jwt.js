'use strict';

const jwt = require(`jsonwebtoken`);
const {HttpCode} = require(`../../constants`);

const {JWT_ACCESS_SECRET} = process.env;

module.exports = (req, res, next) => {

  const authorization = req.headers[`authorization`];

  if (!authorization) {
    res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  const [, token] = authorization.split(` `);


  if (!token) {
    res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  jwt.verify(token, JWT_ACCESS_SECRET || `test`, (err) => {

    if (err) {
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    return next();
  });

};
