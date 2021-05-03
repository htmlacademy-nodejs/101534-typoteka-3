'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': `Введите корректный адрес электронной почты`,
          'any.required': `Поле "e-mail" обязательно для заполнения`,
        }),

  firstName: Joi.string()
        .pattern(/^[a-zA-Zа-яА-ЯёЁ]+$/)
        .required()
        .messages({
          'string.pattern.base': `Поле "Имя" должно содержать только буквы`,
          'any.required': `Поле "Имя" обязательно для заполнения`,
        }),

  lastName: Joi.string()
        .pattern(/^[a-zA-Zа-яА-ЯёЁ]+$/)
        .required()
        .messages({
          'string.pattern.base': `Поле "Фамилия" должно содержать только буквы`,
          'any.required': `Поле "Фамилия" обязательно для заполнения`,
        }),

  password: Joi.string()
        .min(6)
        .required()
        .messages({
          'string.min': `Минимальная длина пароля - 6 символов`,
          'any.required': `Поле "Пароль" обязательно для заполнения`,
        }),

  passwordRepeat: Joi.any()
        .valid(Joi.ref(`password`))
        .messages({
          'any.only': `Пароли не совпадают`,
        }),

  avatar: Joi.string()
        .pattern(/^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)
        .allow(null)
        .messages({
          'string.pattern.base': `Изображение должно быть в формате jpg или png`,
        }),
});
