'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (id) => async (req, res, next) => {
  const param = req.params[id];
  if (isNaN(parseInt(param, 10))) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`article with ${param} not found`);
  }

  return next();
};
