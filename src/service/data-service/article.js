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

    const articles = await this._Article.findAll({include});

    return articles.map((item) => item.get());
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [`categories`, `comments`],
      distinct: true
    });
    return {count, articles: rows};
  }

  async findOne(id, needComments) {
    const include = [`categories`];
    if (needComments) {
      include.push({association: `comments`, include: [`User`]});
    }
    const result = await this._Article.findByPk(id, {include});
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
