'use strict';

const {Router} = require(`express`);
const {HttpCode, ADMIN_ID} = require(`../../constants`);
const authenticateJwt = require(`../middlewares/authenticate-jwt`);
const validator = require(`../middlewares/validator`);
const categoryExist = require(`../middlewares/category-exist`);
const categoryisEmpty = require(`../middlewares/category-is-empty`);
const categorySchema = require(`../schema/category-schema`);

const route = new Router();

module.exports = (app, service, userService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    try {
      const {count} = req.query;
      const categories = await service.findAll(count);
      return res.status(HttpCode.OK)
        .json(categories);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.post(`/add`, [authenticateJwt, categoryExist(service), validator(categorySchema)], async (req, res) => {
    try {
      const category = await service.create(req.body);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.put(`/:id`, [authenticateJwt, validator(categorySchema)], async (req, res) => {
    try {
      const {id} = req.params;
      const category = await service.modify(req.body.name, id);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.delete(`/:id`, [authenticateJwt, categoryisEmpty(service)], async (req, res) => {
    try {
      const {id} = req.params;
      const category = await service.drop(id);
      return res.status(HttpCode.OK)
        .json(category);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.get(`/user/:id`, authenticateJwt, async (req, res) => {
    try {
      const user = await userService.findToken(req.headers[`authorization`].split(` `)[2]) || {id: 1};
      if (user.id !== ADMIN_ID) {
        return res.status(HttpCode.FORBIDDEN);
      }
      const {id} = req.params;
      const categories = await service.findByUser(id);
      return res.status(HttpCode.OK)
        .json(categories);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });
};
