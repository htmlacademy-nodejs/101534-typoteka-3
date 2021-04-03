"use strict";

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

class ArticleCategory extends Model {

}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);
  User.hasMany(Article, {as: `articles`, foreignKey: `userId`});
  Article.belongsTo(User, {foreignKey: `userId`});

  Article.hasMany(Comment, {as: `comments`, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  User.hasMany(Comment, {as: `comments`, foreignKey: `userId`});
  Comment.belongsTo(User, {foreignKey: `userId`});

  ArticleCategory.init({}, {sequelize, tableName: `article_categories`});
  Article.belongsToMany(Category, {through: ArticleCategory, as: `categories`});
  Category.belongsToMany(Article, {through: ArticleCategory, as: `articles`});
  Category.hasMany(ArticleCategory, {as: `article_categories`});

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = define;
