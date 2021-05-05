'use strict';

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData, userId) {
    articleData = {...articleData, userId};
    const article = await this._Article.create({...articleData, userId});
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    await this._Comment.destroy({
      where: {articleId: id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [`categories`];
    if (needComments) {
      include.push(`comments`);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`id`, `DESC`]
      ],
    });

    return articles.map((item) => item.get());
  }

  async findPopular() {
    const include = [`comments`];

    const articles = await this._Article.findAll({
      include,
      attributes: [
        `id`,
        `announce`
      ],
    });

    const popular = articles.map((item) => item.get())
      .filter((el) => {
        return el.comments.length > 0;
      });
    const sorted = popular
      .sort((a, b) => {
        return b.comments.length - a.comments.length;
      }).slice(0, 4);

    return sorted;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [`categories`, `comments`],
      order: [
        [`id`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

  async findOne(id, needComments) {
    const include = [`categories`];
    let result;
    if (needComments) {
      include.push({
        association: `comments`,
        include: [`User`],
      });
      result = await this._Article.findByPk(id, {include, order: [
        [`comments`, `createdAt`, `DESC`]
      ]
      });
      return result;
    }
    result = await this._Article.findByPk(id, {include});
    return result;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

}

module.exports = ArticleService;
