'use strict';

const {Router} = require(`express`);
const userRouter = new Router();
const api = require(`../api.js`).getAPI();
const checkAuth = require(`../middlewares/check-auth`);

userRouter.get(`/`, checkAuth(api), async (req, res) => {
  const user = res.locals.user;
  try {
    const articles = await api.getArticlesByUser(`Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/my`, {articles, user});
  } catch (e) {
    res.redirect(`/login`);
  }

});
userRouter.get(`/comments`, checkAuth(api), async (req, res) => {
  const {user} = res.locals;
  try {
    const comments = await api.getCommentsByUser(`Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/comments`, {comments, user});
  } catch (e) {
    res.redirect(`/login`);
  }


});

module.exports = userRouter;
