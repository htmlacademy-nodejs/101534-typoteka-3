'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  readContent
} = require(`../../utils`);

const {
  ExitCode,
  paths,
  users
} = require(`../../constants`);

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const FILE_NAME = `fill-db.sql`;
const DEFAULT_COUNT = 3;
const MIN_COMMENTS = 2;
const MAX_COMMENTS = 4;


const getFullText = (sentences) => {
  return shuffle(sentences).slice(1, getRandomInt(6, 10)).join(` `);
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count || DEFAULT_COUNT).fill({}).map((_, index) => ({
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(MIN_COMMENTS, MAX_COMMENTS), index + 1, userCount, comments),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    text: getFullText(sentences),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `fill`,
  async run(args) {
    const sentences = await readContent(paths.FILE_SENTENCES_PATH);
    const titles = await readContent(paths.FILE_TITLES_PATH);
    const categories = await readContent(paths.FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(paths.FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10);

    const articles = generateArticles(countArticle, titles, categories.length, users.length, sentences, commentSentences);


    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, text, picture, userId}) =>
          `('${title}', '${text}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) => {
          return `('${text}', ${userId}, ${articleId})`;
        }
    ).join(`,\n`);

    const content = `
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, text, picture, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE article_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }

  }
};
