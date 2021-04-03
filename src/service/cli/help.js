'use strict';

const chalk = require(`chalk`);
const helpText = `Программа запускает http-сервер и формирует файл с данными для API.
    
    Гайд:
    npm run start -- <command>
    Команды:
    --server:             запускает сервер
    --version:            выводит номер версии
    --help:               печатает этот текст
    --filldb <count>    наполняет базу данных моковыми значениями`;

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(helpText));
  }
};
