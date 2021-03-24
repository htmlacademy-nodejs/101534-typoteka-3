'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api.js`).getAPI();

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

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

articlesRouter.get(`/category/:id`, (req, res) => res.send(`/articles/category/:id`));
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
        console.log(e)
        res.render(`admin/new-post`, {articleData});
      }
    }
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [article, comments] = await Promise.all([
    api.getArticle(id),
    api.getComments(id)
  ]);

  res.render(`user/post`, {article, comments});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`user/post`, {article});
});


module.exports = articlesRouter;
