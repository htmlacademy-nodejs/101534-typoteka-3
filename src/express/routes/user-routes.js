'use strict';

const {Router} = require(`express`);
const userRouter = new Router();
const api = require(`../api.js`).getAPI();

userRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`admin/my`, {articles});
});
userRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();


  const commentArrays = await Promise.all([
    api.getComments(articles[0].id),
    api.getComments(articles[1].id),
    api.getComments(articles[2].id)
  ]);
  const comments = [].concat(...commentArrays);

  res.render(`admin/comments`, {comments});
});


module.exports = userRouter;
