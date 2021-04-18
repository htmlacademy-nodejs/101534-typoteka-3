'use strict';


module.exports = (api) => (
  async (req, res, next) => {
    if (req.cookies.accessToken && req.cookies.refreshToken) {
      const token = `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`;
      const user = await api.checkAuth(token);
      res.locals.user = user;
    }


    next();
  }
);
