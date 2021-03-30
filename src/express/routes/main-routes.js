'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api.js`).getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;


  const {count, articles} = await api.getArticles({limit, offset});
  const categories = await api.getCategories(true);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, page, totalPages, categories});
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
