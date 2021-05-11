'use strict';

const version = require(`./version`);
const help = require(`./help`);
const server = require(`./server`);
const fill = require(`./fill`);
const filldb = require(`./filldb`);
const emptydb = require(`./emptydb`);

const Cli = {
  [version.name]: version,
  [help.name]: help,
  [server.name]: server,
  [fill.name]: fill,
  [filldb.name]: filldb,
  [emptydb.name]: emptydb
};

module.exports = {
  Cli
};
