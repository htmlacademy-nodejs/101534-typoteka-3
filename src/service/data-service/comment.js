'use strict';


class CommentService {
  constructor(sequelize) {
    this.Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }
  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }
  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(articleId) {
    const include = [`Article`, `User`];
    if (articleId) {
      return await this._Comment.findAll({
        raw: true,
        where: {articleId},
        include
      });
    } else {
      return await this._Comment.findAll({
        raw: true,
        include
      });
    }

  }

  async findRecent() {
    const include = [`Article`, `User`];

    return await this._Comment.findAll({
      raw: true,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      limit: 4
    });

  }

}

module.exports = CommentService;
