"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {

}

const define = (sequelize) => Article.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
