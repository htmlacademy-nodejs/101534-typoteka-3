'use strict';

const {Router} = require(`express`);
const userRouter = new Router();


userRouter.get(`/`, (req, res) => res.render(`admin/my`));
userRouter.get(`/comments`, (req, res) => res.render(`admin/comments`));


module.exports = userRouter;
