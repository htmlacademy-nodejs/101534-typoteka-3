'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
        .min(30)
        .max(250)
        .required(),

  text: Joi.string()
        .max(1000),

  announce: Joi.string()
        .min(30)
        .max(250)
        .required(),
  picture: Joi.string()
        .pattern(/^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$/),
  createdDate: Joi.string()
        .isoDate()
        .required(),
  categories: Joi.array()
        .items(Joi.string())
        .min(1)
        .required(),
});
