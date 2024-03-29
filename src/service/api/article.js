'use strict';

const {Router} = require(`express`);
const {HttpCode, ADMIN_ID} = require(`../../constants`);
const validator = require(`../middlewares/validator`);
const paramValidator = require(`../middlewares/param-validator`);
const articleExist = require(`../middlewares/article-exists`);
const articleSchema = require(`../schema/article-schema`);
const commentSchema = require(`../schema/comment-schema`);
const authenticateJwt = require(`../middlewares/authenticate-jwt`);

const route = new Router();

module.exports = (app, articleService, commentService, userService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    try {
      const {offset, limit} = req.query;
      let result;
      if (limit || offset) {
        result = await articleService.findPage({limit, offset});
      } else {
        result = await articleService.findAll(true);
      }
      return res.status(HttpCode.OK).json(result);

    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }
  });

  route.get(`/popular`, async (req, res) => {
    try {
      const result = await articleService.findPopular();

      return res.status(HttpCode.OK).json(result);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.get(`/user`, authenticateJwt, async (req, res) => {
    try {
      let user = await userService.findToken(req.headers[`authorization`].split(` `)[2]) || {id: 1};
      if (user.id !== ADMIN_ID) {
        return res.status(HttpCode.FORBIDDEN);
      }

      const result = await articleService.findAll(false);
      return res.status(HttpCode.OK).json(result);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }


  });

  route.get(`/user/comments`, authenticateJwt, async (req, res) => {
    try {
      let user = await userService.findToken(req.headers[`authorization`].split(` `)[2]) || {id: 1};
      if (user.id !== ADMIN_ID) {
        return res.status(HttpCode.FORBIDDEN);
      }
      const comments = await commentService.findAll();
      return res.status(HttpCode.OK).json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }


  });

  route.get(`/comments`, async (req, res) => {
    try {
      const comments = await commentService.findRecent();
      return res.status(HttpCode.OK).json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.get(`/:articleId`, paramValidator(`articleId`), async (req, res) => {
    try {
      const {articleId} = req.params;
      const article = await articleService.findOne(articleId, true);

      if (!article) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found with ${articleId}`);
      }

      return res.status(HttpCode.OK)
        .json(article);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.post(`/`, [authenticateJwt, validator(articleSchema)], async (req, res) => {
    try {
      const user = await userService.findToken(req.headers[`authorization`].split(` `)[2]) || {id: 1};
      if (user.id !== ADMIN_ID) {
        return res.status(HttpCode.FORBIDDEN);
      }
      const article = await articleService.create(req.body, user.id);

      return res.status(HttpCode.CREATED)
        .json(article);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.put(`/:articleId`, [authenticateJwt, paramValidator(`articleId`), validator(articleSchema)], async (req, res) => {
    try {
      const {articleId} = req.params;
      const updated = await articleService.update(articleId, req.body);

      if (!updated) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found with ${articleId}`);
      }

      const updatedArticle = articleService.update(articleId, req.body);

      return res.status(HttpCode.OK)
        .json(updatedArticle);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.delete(`/:articleId`, [authenticateJwt, paramValidator(`articleId`)], async (req, res) => {
    try {
      const {articleId} = req.params;
      const article = await articleService.drop(articleId);

      if (!article) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found`);
      }

      return res.status(HttpCode.OK)
        .json(article);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.get(`/:articleId/comments`, [paramValidator(`articleId`), articleExist(articleService)], async (req, res) => {
    try {
      const {articleId} = req.params;
      const comments = await commentService.findAll(articleId);

      return res.status(HttpCode.OK)
        .json(comments);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }


  });

  route.delete(`/comments/:commentId`, [authenticateJwt, paramValidator(`commentId`)], async (req, res) => {
    try {
      const {commentId} = req.params;
      const deletedComment = await commentService.drop(commentId);

      if (!deletedComment) {
        return res.status(HttpCode.NOT_FOUND)
          .send(`Not found`);
      }

      return res.status(HttpCode.OK)
        .json(deletedComment);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });

  route.post(`/:articleId/comments`, [paramValidator(`articleId`), validator(commentSchema), articleExist(articleService)], async (req, res) => {
    try {
      const {articleId} = req.params;
      const comment = await commentService.create(articleId, req.body);

      return res.status(HttpCode.CREATED)
        .json(comment);
    } catch (e) {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }

  });
};
