'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api.js`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`user/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`user/login`));
mainRouter.get(`/search`, (req, res) => res.render(`user/search`));
mainRouter.get(`/categories`, (req, res) => res.render(`admin/all-categories`));


module.exports = mainRouter;
