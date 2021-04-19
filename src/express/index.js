'use strict';

const express = require(`express`);
const helmet = require(`helmet`);
const chalk = require(`chalk`);
const path = require(`path`);
const session = require(`express-session`);
const cookieParser = require(`cookie-parser`);

const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const userRoutes = require(`./routes/user-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

app.use(helmet.xssFilter());

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(cookieParser());

app.use(session({
  secret: `sssss`,
  cookie: {
    sameSite: `strict`
  }
}));

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
