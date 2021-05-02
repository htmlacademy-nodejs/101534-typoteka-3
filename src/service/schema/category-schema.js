'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  name: Joi.string()
        .min(5)
        .max(30)
        .required()
        .messages({
          'string.min': `Минимум 5 символов`,
          'string.max': `Максимум 30 символов`,
          'string.required': `Поле обязательно для заполнения`,
        }),
});
