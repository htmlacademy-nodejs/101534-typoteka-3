'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api.js`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  const categories = await api.getCategories(true);
  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`user/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`user/login`));
mainRouter.get(`/search`,
    async (req, res) => {
      try {
        const {search} = req.query;
        if (!search) {
          res.render(`user/search`);
        }

        const results = await api.search(search);

        res.render(`user/search`, {
          results
        });
      } catch (error) {
        res.render(`user/search`, {
          results: `нет совпадений`
        });
      }
    });
mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories(true);
  res.render(`admin/all-categories`, {categories});
});


module.exports = mainRouter;
