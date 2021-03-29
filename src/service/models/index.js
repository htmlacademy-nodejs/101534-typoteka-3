"use strict";

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

class articleCategory extends Model {

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

  articleCategory.init({}, {sequelize});
  Article.belongsToMany(Category, {through: articleCategory, as: `categories`});
  Category.belongsToMany(Article, {through: articleCategory, as: `articles`});
  Category.hasMany(articleCategory, {as: `articleСategories`});

  return {Category, Comment, Article, articleCategory, User};
};

module.exports = define;
