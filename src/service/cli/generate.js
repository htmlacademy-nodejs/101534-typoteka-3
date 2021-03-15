'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);


const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const {
  ExitCode,
  MAX_ID_LENGTH,
  paths
} = require(`../../constants`);

const FILE_NAME = `mocks.json`;
const DEFAULT_COUNT = 1;
const MAX_COMMENTS = 4;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getRandomDate = (months = 1) => {
  const secondDate = new Date();
  const firstDate = new Date(secondDate.getFullYear(), secondDate.getMonth() - months + 1);
  const createdDate = new Date(getRandomInt(firstDate.getTime(), secondDate.getTime())).toLocaleDateString();
  return createdDate;
};

const getAnnounceText = (sentences) => {
  return shuffle(sentences).slice(1, getRandomInt(2, 6)).join(` `);
};

const getFullText = (sentences) => {
  return shuffle(sentences).slice(1, getRandomInt(6, 10)).join(` `);
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (count, titles, categories, sentences, comments) => (
  Array(count || DEFAULT_COUNT).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(3),
    announce: getAnnounceText(sentences),
    fullText: getFullText(sentences),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    picture: `sea-fullsize@1x.jpg`
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(paths.FILE_SENTENCES_PATH);
    const titles = await readContent(paths.FILE_TITLES_PATH);
    const categories = await readContent(paths.FILE_CATEGORIES_PATH);
    const comments = await readContent(paths.FILE_COMMENTS_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10);
    if (countOffer > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }


    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }

  }
};
