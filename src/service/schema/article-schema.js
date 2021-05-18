'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
        .min(30)
        .max(250)
        .required()
        .messages({
          'string.min': `Минимум 30 символов`,
          'string.max': `Максимум 250 символов`,
          'any.required': `Поле обязательно для заполнения`,
        }),

  text: Joi.string()
            .max(1000)
            .allow(null, ``)
            .messages({
              'string.max': `Максимум 1000 символов`,
            }),

  announce: Joi.string()
        .min(30)
        .max(250)
        .required()
        .messages({
          'string.min': `Минимум 30 символов`,
          'string.max': `Максимум 250 символов`,
          'any.required': `Поле обязательно для заполнения`,
        }),
  picture: Joi.string()
        .allow(null)
        .pattern(/^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)
        .messages({
          'string.pattern.base': `Изображение должно быть в формате png или jpg`,
        }),
  createdDate: Joi.string()
        .isoDate(),
  categories: Joi.array()
        .items(Joi.string())
        .min(1)
            .required()
            .messages({
              'any.required': `Обязательна хотя бы 1 категория`,
            }),
});
