'use strict';

const Sequelize = require(`sequelize`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, Sequelize.col(`article_categories`, `CategoryId`)), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: `article_categories`,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
