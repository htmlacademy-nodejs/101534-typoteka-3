'use strict';
const {HttpCode} = require(`../../constants`);

module.exports = (userService) => (
  async (req, res, next) => {
    const {email, password} = req.body;
    const existsUser = await userService.findByEmail(email);

    if (!existsUser) {
      res.status(HttpCode.FORBIDDEN)
              .json({message: `Пользователь не найден`});

      return;
    }

    if (!await userService.checkUser(email, password)) {
      res.status(HttpCode.FORBIDDEN)
              .json({message: `Неверный пароль`});

      return;
    }

    res.locals.user = existsUser;
    next();
  }
);
