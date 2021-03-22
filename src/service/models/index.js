"use strict";

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);

class ArticleCategory extends Model {

}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {as: `comments`, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: `categories`});
  Category.belongsToMany(Article, {through: ArticleCategory, as: `articles`});
  Category.hasMany(ArticleCategory, {as: `articles`});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
