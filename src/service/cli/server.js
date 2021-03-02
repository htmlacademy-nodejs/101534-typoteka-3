'use strict';

const express = require(`express`);
const {
  HttpCode, API_PREFIX
} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());
app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});
app.use(API_PREFIX, routes.app);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
  .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port)
      .on(`listening`, () => {
        routes.init();
        return logger.info(`Listening to connections on ${port}`);
      })
      .on(`error`, (err) => {
        return logger.error(`An error occured on server creation: ${err.message}`);
      });

  }
};
