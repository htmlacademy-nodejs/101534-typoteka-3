'use strict';

const sequelize = require(`../lib/sequelize`);
const {logger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);


module.exports = {
  name: `--emptydb`,
  async run() {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);


    return initDatabase(sequelize, [], `[]`, []);

  }
};
