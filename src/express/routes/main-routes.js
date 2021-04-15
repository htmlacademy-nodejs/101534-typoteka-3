'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api.js`).getAPI();

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const UPLOAD_DIR = `../upload/img/avatars/`;
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

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const avatar = file ? file.filename : null;
  const userData = {
    avatar,
    email: body.email,
    firstName: body.name,
    lastName: body.surname,
    password: body.password,
    passwordRepeat: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (e) {
    let errorMessages;
    if (e.response && e.response.data) {
      errorMessages = e.response.data.message;
    }
    res.render(`user/sign-up`, {userData, errorMessages});
  }

});

mainRouter.get(`/login`, (req, res) => res.render(`user/login`));

mainRouter.post(`/login`, upload.none(), async (req, res) => {
  const {body} = req;
  const userData = {
    email: body.email,
    password: body.password
  };

  try {
    await api.login(userData);
    res.redirect(`/`);
  } catch (e) {
    let errorMessages;
    if (e.response && e.response.data) {
      errorMessages = e.response.data.message;
    }
    res.render(`user/login`, {userData, errorMessages});
  }

});

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
