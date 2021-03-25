'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const {logger, getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);


const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const {
  ExitCode,
  MAX_ID_LENGTH,
  paths,
  users
} = require(`../../constants`);

const FILE_NAME = `mocks.json`;
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const getRandomDate = (months = 1) => {
  const secondDate = new Date();
  const firstDate = new Date(secondDate.getFullYear(), secondDate.getMonth() - months + 1);
  const createdDate = new Date(getRandomInt(firstDate.getTime(), secondDate.getTime())).toLocaleDateString();
  return createdDate;
};

const getRandomSubarray = (items, maxCount) => {
  items = items.slice();
  let count = getRandomInt(1, maxCount || items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, maxCount || items.length - 1), 1
        )
    );
  }
  return result;
};

const getAnnounceText = (sentences) => {
  return shuffle(sentences).slice(1, getRandomInt(2, 6)).join(` `);
};

const getFullText = (sentences) => {
  return shuffle(sentences).slice(1, getRandomInt(6, 10)).join(` `);
};

const generateComments = (count, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categories, sentences, comments, userCount) => (
  Array(count || DEFAULT_COUNT).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(3),
    announce: getAnnounceText(sentences),
    text: getFullText(sentences),
    categories: getRandomSubarray(categories, 4),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), 3, comments),
    picture: `sea-fullsize@1x.jpg`,
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(paths.FILE_SENTENCES_PATH);
    const titles = await readContent(paths.FILE_TITLES_PATH);
    const categories = await readContent(paths.FILE_CATEGORIES_PATH);
    const comments = await readContent(paths.FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || 3;
    if (countArticle > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }


    const articles = JSON.stringify(generateArticles(countArticle, titles, categories, sentences, comments, 3));

    return initDatabase(sequelize, categories, articles, users);

  }
};
