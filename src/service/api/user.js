'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const validator = require(`../middlewares/validator`);
const alreadyRegistered = require(`../middlewares/already-register`);
const authenticate = require(`../middlewares/authenticate`);
const userSchema = require(`../schema/user-schema`);
const bcrypt = require(`bcrypt`);
const {makeTokens} = require(`../lib/jwt-helper`);
const jwt = require(`jsonwebtoken`);
const saltRounds = 10;

const {JWT_REFRESH_SECRET} = process.env;

const route = new Router();

module.exports = (app, userService) => {
  app.use(`/user`, route);

  route.post(`/`, [alreadyRegistered(userService), validator(userSchema)], async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const user = await userService.create({...req.body, password: hash});

    return res.status(HttpCode.CREATED)
      .json(user);
  });

  route.post(`/auth`, authenticate(userService), async (req, res) => {
    const {id} = res.locals.user;
    const {accessToken, refreshToken} = makeTokens({id});
    await userService.addToken(id, refreshToken);
    return res.json({accessToken, refreshToken});
  });

  route.post(`/refresh`, async (req, res) => {
    const {token} = req.body;

    if (!token) {
      return res.sendStatus(HttpCode.BAD_REQUEST);
    }

    const existToken = await userService.findToken(token);

    if (!existToken) {
      return res.sendStatus(HttpCode.NOT_FOUND);
    }

    jwt.verify(token, JWT_REFRESH_SECRET, async (err, userData) => {
      if (err) {
        return res.sendStatus(HttpCode.FORBIDDEN);
      }

      const {id} = userData;
      const {accessToken, refreshToken} = makeTokens({id});

      await userService.dropToken(existToken);
      await userService.addToken(refreshToken);

      return res.json({accessToken, refreshToken});
    });
    return true;
  });
};
