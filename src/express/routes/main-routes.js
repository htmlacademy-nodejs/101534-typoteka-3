'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api.js`).getAPI();
const checkAuth = require(`../middlewares/check-auth`);
const csrfProtection = require(`../middlewares/csrf`);
const parseForm = require(`../middlewares/parse-form`);
const {ADMIN_ID} = require(`../../constants`);

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


mainRouter.get(`/`, checkAuth(api), async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;


  const {count, articles} = await api.getArticles({limit, offset});
  const categories = await api.getCategories(true);
  const popular = await api.getPopularArticles(true);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const user = res.locals.user;
  let isAdmin = false;
  if (user && user.id === ADMIN_ID) {
    isAdmin = true;
  }
  res.render(`main`, {articles, page, totalPages, categories, user, isAdmin, popular});
});

mainRouter.get(`/register`, csrfProtection, (req, res) => {
  res.render(`user/sign-up`, {csrf: req.csrfToken()});
});

mainRouter.post(`/register`, upload.single(`avatar`), parseForm, csrfProtection, async (req, res) => {
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
    res.render(`user/sign-up`, {userData, errorMessages, csrf: req.csrfToken()});
  }

});

mainRouter.get(`/login`, csrfProtection, (req, res) => {
  res.render(`user/login`, {
    csrf: req.csrfToken()
  });
});

mainRouter.post(`/login`, upload.none(), parseForm, csrfProtection, async (req, res) => {
  const {body} = req;
  const userData = {
    email: body.email,
    password: body.password
  };

  try {
    const {accessToken, refreshToken} = await api.login(userData);

    res.cookie(`accessToken=${accessToken}`, {maxAge: 864000});
    res.cookie(`refreshToken=${refreshToken}`, {maxAge: 864000});

    res.redirect(`/`);
  } catch (e) {
    let errorMessages;
    if (e.response && e.response.data) {
      errorMessages = e.response.data.message;
    }
    res.render(`user/login`, {userData, errorMessages, csrf: req.csrfToken()});
  }

});

mainRouter.get(`/logout`, upload.none(), async (req, res) => {
  await api.logout(`Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);

  res.cookie(`accessToken=null`, {maxAge: 0});
  res.cookie(`refreshToken=null`, {maxAge: 0});

  res.redirect(`/login`);


});

mainRouter.get(`/search`, checkAuth(api),
    async (req, res) => {
      const user = res.locals.user;
      try {
        const {search} = req.query;
        if (!search) {
          res.render(`user/search`);
        }

        const results = await api.search(search);

        res.render(`user/search`, {
          results,
          user
        });
      } catch (error) {
        res.render(`user/search`, {
          results: `нет совпадений`,
          user
        });
      }
    });

mainRouter.get(`/categories`, checkAuth(api), async (req, res) => {
  const user = res.locals.user;
  if (!user) {
    return res.redirect(`/login`);
  }
  try {
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    return res.render(`admin/all-categories`, {categories, user});
  } catch (e) {
    return res.redirect(`/login`);
  }

});

mainRouter.post(`/categories/add`, [upload.none(), checkAuth(api)], async (req, res) => {
  const user = res.locals.user;
  if (!user || user.id !== ADMIN_ID) {
    res.redirect(`/login`);
  }

  try {
    await api.createCategory(req.body, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/all-categories`, {categories, user});
  } catch (e) {
    let errorMessages;
    if (e.response && e.response.data) {
      errorMessages = e.response.data.message;
    }
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/all-categories`, {categories, user, errorMessages});
  }

});

mainRouter.post(`/categories/:id/modify`, [upload.none(), checkAuth(api)], async (req, res) => {
  const user = res.locals.user;
  const {id} = req.params;
  if (!user || user.id !== ADMIN_ID) {
    res.redirect(`/login`);
  }

  try {
    await api.modifyCategory({name: req.body.name}, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`, id);
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/all-categories`, {categories, user});
  } catch (e) {
    let errorMessages;
    if (e.response && e.response.data) {
      errorMessages = e.response.data.message;
    }
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/all-categories`, {categories, user, errorMessages});
  }

});

mainRouter.post(`/categories/:id/delete`, [upload.none(), checkAuth(api)], async (req, res) => {
  const user = res.locals.user;
  const {id} = req.params;
  if (!user || user.id !== ADMIN_ID) {
    res.redirect(`/login`);
  }

  try {
    await api.deleteCategory({id}, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/all-categories`, {categories, user});
  } catch (e) {
    let errorMessages;
    if (e.response && e.response.data) {
      errorMessages = e.response.data.message;
    }
    const categories = await api.getCategoriesByUser(user, `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`);
    res.render(`admin/all-categories`, {categories, user, errorMessages});
  }

});


module.exports = mainRouter;
