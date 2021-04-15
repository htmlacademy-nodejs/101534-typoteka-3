'use strict';
const bcrypt = require(`bcrypt`);

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const user = await this._User.create(userData);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({where: {email}});
    return user;
  }

  async checkUser(email, password) {
    const user = await this._User.findOne({where: {email}});
    const match = await bcrypt.compare(password, user.password);
    return match;
  }

  async addToken(id, token) {
    const [affectedRows] = await this._User.update({token}, {
      where: {id}
    });
    return !!affectedRows;
  }

  async find(token) {
    const user = await this._User.findOne({where: {token}});
    return user;
  }

  async dropToken(token) {
    const [affectedRows] = await this._User.update({token: null}, {
      where: {token}
    });
    return !!affectedRows;
  }

}

module.exports = UserService;
