'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    const {id} = req.params;
    let count = await service.countByCategory(id);

    if (count > 0) {
      res.status(HttpCode.BAD_REQUEST)
                      .json({message: [{alreadyExist: `Нельзя удалить непустую категорию`}]});
      return;
    }

    next();
  }
);
