'use strict';

const {Router} = require(`express`);
const userRouter = new Router();
const api = require(`../api.js`).getAPI();
const checkAuth = require(`../middlewares/check-auth`);

userRouter.get(`/`, checkAuth(api), async (req, res) => {
  const user = res.locals.user;
  const articles = await api.getArticlesByUser(`Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
  res.render(`admin/my`, {articles, user});
});
userRouter.get(`/comments`, checkAuth(api), async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const {user} = res.locals;

  const commentArrays = await Promise.all([
    api.getComments(articles[0].id),
    api.getComments(articles[1].id),
    api.getComments(articles[2].id)
  ]);
  const comments = [].concat(...commentArrays);

  res.render(`admin/comments`, {articles, comments, user});
});

module.exports = userRouter;
