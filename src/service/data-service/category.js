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
      return await this._Category.findAll({raw: true});
    }
  }

  async countByCategory(id) {
    const result = await this._ArticleCategory.findAll({
      where: {categoryId: id}
    });
    const count = result.map((it) => it.get()).length;
    return +count;
  }

  async findByUser() {
    return await this._Category.findAll({raw: true});
  }

  async findByName(name) {
    return await this._Category.findOne({where: {name}});
  }

  async create(data) {
    return await this._Category.create({
      name: data.name
    });
  }

  async modify(name, id) {
    return await this._Category.update(
        {name},
        {where: {id}}
    );
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = CategoryService;
