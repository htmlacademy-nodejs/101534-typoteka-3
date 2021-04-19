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

  async findAll(id) {
    const include = [`Article`];
    return await this._Comment.findAll({
      where: {id},
      raw: true,
      include
    });
  }

}

module.exports = CommentService;
