'use strict';

module.exports = {
  DEFAULT_COMMAND: `help`,
  USER_ARGV_INDEX: 2,
  ExitCode: {
    error: 1,
    success: 0,
  },
  HttpCode: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
  },
  MAX_ID_LENGTH: 6,
  API_PREFIX: `/api`,
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`
  },
  paths: {
    FILE_SENTENCES_PATH: `./data/sentences.txt`,
    FILE_TITLES_PATH: `./data/titles.txt`,
    FILE_CATEGORIES_PATH: `./data/categories.txt`,
    FILE_COMMENTS_PATH: `./data/comments.txt`
  },
  users: [
    {
      email: `ivanov@example.com`,
      passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
      firstName: `Иван`,
      lastName: `Иванов`,
      avatar: `avatar1.jpg`
    },
    {
      email: `petrov@example.com`,
      passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
      firstName: `Пётр`,
      lastName: `Петров`,
      avatar: `avatar2.jpg`
    },
    {
      email: `test@example.com`,
      passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
      firstName: `Тест`,
      lastName: `Тестов`,
      avatar: `avatar3.jpg`
    }
  ]
};
