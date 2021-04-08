'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api.js`).getAPI();

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

articlesRouter.get(`/category/:id`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

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
  res.render(`user/articles-by-category`, {articlesByPage, categories, id, name, page, totalPages});
});

articlesRouter.get(`/add`, (req, res) => res.render(`admin/new-post`));

articlesRouter.post(`/add`,
    upload.single(`photo`),
    async (req, res) => {
      const {body, file} = req;
      const articleData = {
        picture: file.filename,
        createdDate: body.date,
        title: body.title,
        announce: body.announcement,
        text: body[`full-text`],
        categories: body.category
      };

      try {

        await api.createArticle(articleData);
        res.redirect(`/my`);
      } catch (e) {
        const errorMessages = e.response.data.message;
        res.render(`admin/new-post`, {articleData, errorMessages});
      }
    }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [articleData, comments] = await Promise.all([
    api.getArticle(id),
    api.getComments(id)
  ]);
  const route = `articles/edit/${id}`;

  res.render(`admin/new-post`, {articleData, comments, route});
});

articlesRouter.post(`/edit/:id`, upload.single(`photo`), async (req, res) => {
  const {id} = req.params;

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
    res.render(`admin/new-post`, {articleData, errorMessages});
  }

});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const article = await api.getArticle(id, true);
    res.render(`user/post`, {article});
  } catch (err) {
    console.log(err.response.status);
    res.status(400).render(`errors/404`);
  }

});

articlesRouter.post(`/:id/comments`, upload.single(`photo`), async (req, res) => {
  const {id} = req.params;

  const {body} = req;
  const commentData = {
    text: body.text
  };

  try {

    await api.createComment(id, commentData);
    res.redirect(`/articles/${id}`);
  } catch (e) {
    const errorMessages = e.response.data.message;
    const article = await api.getArticle(id, true);
    res.render(`user/post`, {article, errorMessages});
  }

});

module.exports = articlesRouter;
