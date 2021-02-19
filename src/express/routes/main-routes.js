'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`main`));
mainRouter.get(`/register`, (req, res) => res.render(`user/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`user/login`));
mainRouter.get(`/search`, (req, res) => res.render(`user/search`));
mainRouter.get(`/categories`, (req, res) => res.render(`admin/all-categories`));


module.exports = mainRouter;
