'use strict';


module.exports = (api) => (
  async (req, res, next) => {
    if (req.cookies.accessToken && req.cookies.refreshToken) {
      const token = `Bearer ${req.cookies.accessToken.split(`=`)[0]} ${req.cookies.refreshToken.split(`=`)[0]}`;
      try {
        const user = await api.checkAuth(token);
        res.locals.user = user;
      } catch (error) {

        try {
          const {accessToken, refreshToken} = await api.refresh(token);
          res.cookie(`accessToken=${accessToken}`, {maxAge: 864000});
          res.cookie(`refreshToken=${refreshToken}`, {maxAge: 864000});
        } catch (err) {
          console.log(err);
        }
      }

    }

    next();
  }
);
