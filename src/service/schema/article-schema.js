'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
        .min(2)
        .max(150)
        .required(),

  text: Joi.string()
        .min(2)
        .max(1000)
        .required(),

  announce: Joi.string()
        .min(2)
        .max(500)
        .required(),
  picture: Joi.string()
        .min(2)
        .max(100)
        .required(),
  createdDate: Joi.string()
        .isoDate()
        .required(),
  categories: Joi.array()
        .items(Joi.string())
});
