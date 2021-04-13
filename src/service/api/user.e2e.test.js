'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);

const user = require(`./user`);
const DataService = require(`../data-service/user`);
const {HttpCode} = require(`../../constants`);

const mockUsers = [
  {
    email: `ivanov@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  },
  {
    email: `test@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Тест`,
    lastName: `Тестов`,
    avatar: `avatar3.jpg`
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, [], `[]`, mockUsers);
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockUsers));
  app.use(express.json());
  user(app, new DataService(mockDB));
  return app;
};

describe(`API creates new user if data is valid`, () => {

  const newUser = {
    email: `new@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    passwordRepeat: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(newUser);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

});

describe(`API refuses to create new user if data is invalid`, () => {

  let newUser1 = {
    email: `ivanov@example.com`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    passwordRepeat: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`API returns code 400 if user with given email is already registered`, async () => {

    await request(app)
      .post(`/user`)
      .send(newUser1)
      .expect(HttpCode.BAD_REQUEST)
  });

  let newUser2 = {
	  email: `newuser@example.com`,
	  password: `5f4dcc3b5aa765d61d8327deb882cf99`,
	  passwordRepeat: `5f4dcc3b5`,
	  firstName: `Иван`,
	  lastName: `Иванов`,
	  avatar: `avatar1.jpg`
	};


  test(`API returns code 400 if password and passwordRepeat have different values`, async () => {

    await request(app)
      .post(`/user`)
      .send(newUser2)
      .expect(HttpCode.BAD_REQUEST)
  });

  let newUser3 = {
	  email: `newuser@example.com`,
	  password: `5f4dcc3b5aa765d61d8327deb882cf99`,
	  passwordRepeat: `5f4dcc3b5aa765d61d8327deb882cf99`,
	  firstName: `Иван!$%`,
	  lastName: `Иванов`,
	  avatar: `avatar1.jpg`
	};


  test(`API returns code 400 if name field contains special symbols`, async () => {

    await request(app)
      .post(`/user`)
      .send(newUser3)
      .expect(HttpCode.BAD_REQUEST)
  });

  let newUser4 = {
	  email: `newuser@example.com`,
	  password: `5f4dcc3b5aa765d61d8327deb882cf99`,
	  passwordRepeat: `5f4dcc3b5aa765d61d8327deb882cf99`,
	  firstName: `Иван`,
	  lastName: `Иванов`,
	  avatar: `avatar1.js`
	};


  test(`API returns code 400 if avatar field has wrong extension`, async () => {

    await request(app)
      .post(`/user`)
      .send(newUser4)
      .expect(HttpCode.BAD_REQUEST)
  });

  let newUser5 = {
	  email: `newuser@example.com`,
	  password: `123`,
	  passwordRepeat: `123`,
	  firstName: `Иван`,
	  lastName: `Иванов`,
	  avatar: `avatar1.png`
	};

  test(`API returns code 400 if password is too short`, async () => {

    await request(app)
      .post(`/user`)
      .send(newUser5)
      .expect(HttpCode.BAD_REQUEST)
  });

  let newUser6 = {
	  email: `newuser@example.com`,
	  password: `123456`,
	  passwordRepeat: `123456`,
	  firstName: `Иван`,
	  avatar: `avatar1.png`
	};

  test(`API returns code 400 if required field wasnt passed`, async () => {

    await request(app)
      .post(`/user`)
      .send(newUser6)
      .expect(HttpCode.BAD_REQUEST)
  });


});
