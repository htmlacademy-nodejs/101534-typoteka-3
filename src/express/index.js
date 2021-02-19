'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const userRoutes = require(`./routes/user-routes`);

const DEFAULT_PORT = 8010;
const PUBLIC_DIR = `public`;

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, userRoutes);

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res) => res.status(500).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);


app.listen(DEFAULT_PORT)
  .on(`listening`, () => {
    return console.info(chalk.green(`Ожидаю соединений на ${DEFAULT_PORT}`));
  })
  .on(`error`, (err) => {
    return console.error(`Ошибка при создании сервера`, err);
  });
