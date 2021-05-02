'use strict';

const {Router} = require(`express`);
const {HttpCode, ADMIN_ID} = require(`../../constants`);
const authenticateJwt = require(`../middlewares/authenticate-jwt`);
const validator = require(`../middlewares/validator`);
const categoryExist = require(`../middlewares/category-exist`);
const categorySchema = require(`../schema/category-schema`);

const route = new Router();

module.exports = (app, service, userService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/add`, [authenticateJwt, categoryExist(service), validator(categorySchema)], async (req, res) => {
    const category = await service.create(req.body);
    res.status(HttpCode.OK)
      .json(category);
  });

  route.get(`/user/:id`, authenticateJwt, async (req, res) => {
    let user = await userService.findToken(req.headers[`authorization`].split(` `)[2]) || {id: 1};
    if (user.id !== ADMIN_ID) {
      res.status(HttpCode.FORBIDDEN);
    }
    const {id} = req.params;
    const categories = await service.findByUser(id);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
