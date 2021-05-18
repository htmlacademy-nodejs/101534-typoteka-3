'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {name} = req.body;
    const exist = await service.findByName(name);

    if (exist) {
      res.status(HttpCode.BAD_REQUEST)
        .json({message: [{alreadyExist: `Такая категория уже существует`}]});
      return;
    }

    next();
  }
);
