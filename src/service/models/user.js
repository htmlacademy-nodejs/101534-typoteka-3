"use strict";

const {DataTypes, Model} = require(`sequelize`);

class User extends Model {

}

const define = (sequelize) => User.init({
  avatar: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

module.exports = define;
