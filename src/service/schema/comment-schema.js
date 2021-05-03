'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({

  text: Joi.string()
        .min(20)
        .max(1000)
    .required()
    .messages({
      'string.min': `Минимум 20 символов`,
      'string.max': `Максимум 1000 символов`,
      'any.required': `Поле обязательно для заполнения`,
    }),
  userId: Joi.number(),


});
