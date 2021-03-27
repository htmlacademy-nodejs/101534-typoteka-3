"use strict";

const defineModels = require(`../models`);

module.exports = async (sequelize, categories, articles, users) => {

  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      JSON.parse(categories).map((item) => ({name: item}))
  );

  const userModels = await User.bulkCreate(
      users.map((item) => ({
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName
      }))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlePromises = (JSON.parse(articles)).map(async (article) => {
    const articleModel = await Article.create(article, {include: `comments`});
    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });
  await Promise.all(articlePromises);
};
