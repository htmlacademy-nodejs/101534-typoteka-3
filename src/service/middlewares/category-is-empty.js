'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (
  async (req, res, next) => {
    try {
      const {id} = req.params;
      let count = await service.countByCategory(id);

      if (count > 0) {
        res.status(HttpCode.BAD_REQUEST)
          .json({message: [{alreadyExist: `Нельзя удалить непустую категорию`}]});
        return;
      }
    } catch (e) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR);
    }


    next();
  }
);
