'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const validator = require(`../middlewares/validator`);
const alreadyRegistered = require(`../middlewares/already-register`);
const userSchema = require(`../schema/user-schema`);
const bcrypt = require(`bcrypt`);
const saltRounds = 10;

const route = new Router();

module.exports = (app, userService) => {
  app.use(`/user`, route);

  route.post(`/`, [alreadyRegistered(userService), validator(userSchema)], async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const user = await userService.create({...req.body, password: hash});

    return res.status(HttpCode.CREATED)
      .json(user);
  });
};
