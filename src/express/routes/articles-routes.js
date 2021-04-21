'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api.js`).getAPI();
const checkAuth = require(`../middlewares/check-auth`);

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const ARTICLES_PER_PAGE = 8;

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, checkAuth(api), async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const user = res.locals.user;

  const {id} = req.params;
  const articles = await api.getArticles();
  const categories = await api.getCategories(true);
  const name = categories.find((cat) => {
    return cat.id === +id;
  }).name;
  const categoryArticles = articles.filter((article) => {
    return article.categories.some((cat) => {
      return cat.id === +id;
    });
  });
  const totalPages = Math.ceil(categoryArticles.length / ARTICLES_PER_PAGE);
  const articlesByPage = categoryArticles.slice(offset, offset + limit);
  res.render(`user/articles-by-category`, {articlesByPage, categories, id, name, page, totalPages, user});
});

articlesRouter.get(`/add`, checkAuth(api), async (req, res) => {
  const user = res.locals.user;
  if (!user || user.id !== 1) {
    return res.redirect(`/login`);
  }
  const categories = await api.getCategories(true);
  return res.render(`admin/new-post`, {categories, user});
});

articlesRouter.post(`/add`,
    [upload.single(`photo`), checkAuth(api)],
    async (req, res) => {
      const {body, file} = req;
      const articleData = {
        picture: file.filename,
        createdDate: body.date,
        title: body.title,
        announce: body.announcement,
        text: body[`full-text`],
        categories: [...body.categories]
      };
      const user = res.locals.user;

      const token = `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`;

      try {

        await api.createArticle(articleData, token);
        res.redirect(`/my`);
      } catch (e) {
        let errorMessages;
        if (e.response && e.response.data) {
          errorMessages = e.response.data.message;
        }

        const categories = await api.getCategories(true);
        res.render(`admin/new-post`, {articleData, errorMessages, categories, user});
      }
    }
);

articlesRouter.get(`/edit/:id`, checkAuth(api), async (req, res) => {
  const {id} = req.params;
  const {user} = res.locals;

  const [articleData, comments] = await Promise.all([
    api.getArticle(id),
    api.getComments(id)
  ]);
  const route = `articles/edit/${id}`;

  res.render(`admin/new-post`, {articleData, comments, route, user});
});

articlesRouter.post(`/edit/:id`, [upload.single(`photo`), checkAuth(api)], async (req, res) => {
  const {id} = req.params;
  const {user} = res.locals;

  const {body, file} = req;
  const articleData = {
    picture: file.filename,
    createdDate: body.date,
    title: body.title,
    announce: body.announcement,
    text: body[`full-text`],
    categories: body.categories
  };

  try {

    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (e) {
    const errorMessages = e.response.data.message;
    res.render(`admin/new-post`, {articleData, errorMessages, user});
  }

});

articlesRouter.get(`/:id`, checkAuth(api), async (req, res) => {
  const {id} = req.params;
  const {user} = res.locals;
  try {
    const article = await api.getArticle(id, true);
    res.render(`user/post`, {article, user});

  } catch (err) {
    res.status(400).render(`errors/404`);
  }

});

articlesRouter.post(`/:id`, checkAuth(api), async (req, res) => {
  const {id} = req.params;

  try {
    await api.dropArticle(id, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.redirect(`/my`);
  } catch (err) {
    res.status(400).render(`errors/404`);
  }

});

articlesRouter.post(`/:id/comment/:commentId`, checkAuth(api), async (req, res) => {
  const {commentId} = req.params;
  try {
    await api.dropComment(commentId, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.redirect(`/my/comments`);
  } catch (err) {
    res.status(400).render(`errors/404`);
  }

});

articlesRouter.post(`/:id/comments`, checkAuth(api), upload.single(`photo`), async (req, res) => {
  const {id} = req.params;
  const {user} = res.locals;

  const {body} = req;
  const commentData = {
    text: body.text,
    userId: user.id
  };

  try {

    await api.createComment(id, commentData);
    res.redirect(`/articles/${id}`);
  } catch (e) {
    const errorMessages = e.response.data.message;
    const article = await api.getArticle(id, true);
    res.render(`user/post`, {article, errorMessages, user});
  }

});

module.exports = articlesRouter;
