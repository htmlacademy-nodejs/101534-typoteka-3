'use strict';

const fs = require(`fs`).promises;

const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const {
  ExitCode
} = require(`../../constants`);

const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const DEFAULT_COUNT = 1;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\r\n`);
  } catch (err) {
    console.error(err);
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

const generateOffers = (count, titles, categories, sentences) => (
  Array(count || DEFAULT_COUNT).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(3),
    announce: getAnnounceText(sentences),
    fullText: getFullText(sentences),
    category: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10);
    if (countOffer > 1000) {
      console.error(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }


    const content = JSON.stringify(generateOffers(countOffer, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(`Operation success. File created.`);
    } catch (err) {
      console.error(`Can't write data to file...`);
      process.exit(ExitCode.error);
    }

  }
};
