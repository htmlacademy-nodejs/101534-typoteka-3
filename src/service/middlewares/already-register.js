'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {email} = req.body;
    const exist = await service.findByEmail(email);

    if (exist) {
      res.status(HttpCode.BAD_REQUEST)
        .json({message: [{alreadyExist: `Пользователь с таким email уже зарегистрирован`}]});
      return;
    }

    next();
  }
);
