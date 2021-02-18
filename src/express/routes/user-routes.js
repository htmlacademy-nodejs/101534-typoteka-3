'use strict';

const {Router} = require(`express`);
const userRouter = new Router();


userRouter.get(`/`, (req, res) => res.send(`/my`));
userRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));


module.exports = userRouter;
