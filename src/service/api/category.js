'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const authenticateJwt = require(`../middlewares/authenticate-jwt`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/user/:id`, authenticateJwt, async (req, res) => {
    const {id} = req.params;
    const categories = await service.findByUser(id);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
