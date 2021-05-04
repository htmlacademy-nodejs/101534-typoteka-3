'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const { HttpCode } = require(`../../constants`);

const {makeTokens} = require(`../lib/jwt-helper`);

const mockCategories = [
  `Программирование`,
  `Путешествия`,
  `Кино`,
  `Музыка`
];



const mockArticles = JSON.stringify([
  {
    "title": `Финал на краю вселенной`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Сотрясение мозга – очень серьезно. Пора перестать восхищаться теми, кто возвращается в поле после травм головы. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "text": `Собрать камни бесконечности легко, если вы прирожденный герой. Медведев сейчас так хорош, что обводит даже одноручным бэкхендом. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "categories": [
      `Программирование`,
      `Кино`
    ],
    "comments": [
      {
        "text": `Совсем немного... Согласен с автором!`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "title": `Главная гонка Америки`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "text": `Медведев сейчас так хорош, что обводит даже одноручным бэкхендом. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Леброн пробежал половину площадки с мячом в руках и забил сверху. Разве это не пробежка?`,
    "categories": [
      `Музыка`
    ],
    "comments": [
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "title": `Как собрать камни бесконечности`,
    "announce": `Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Медведев сейчас так хорош, что обводит даже одноручным бэкхендом.`,
    "text": `Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Леброн пробежал половину площадки с мячом в руках и забил сверху. Разве это не пробежка?`,
    "categories": [
      `Путешествия`
    ],
    "comments": [
      {
        "text": `Плюсую, но слишком много буквы! Хочу такую же футболку :-) Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Планируете записать видосик на эту тему? Это где ж такие красоты?`
      },
      {
        "text": `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "title": `Бег, плавание или йога`,
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "text": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Медведев сейчас так хорош, что обводит даже одноручным бэкхендом. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Сотрясение мозга – очень серьезно. Пора перестать восхищаться теми, кто возвращается в поле после травм головы.`,
    "categories": [
      `Программирование`
    ],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором!`
      },
      {
        "text": `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "title": `Биатлон в горах`,
    "announce": `Медведев сейчас так хорош, что обводит даже одноручным бэкхендом. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "text": `Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Медведев сейчас так хорош, что обводит даже одноручным бэкхендом.`,
    "categories": [
      `Кино`
    ],
    "comments": [
      {
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "text": `Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ],
    "picture": `Image.jpg`
  }
]);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});


describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
  	const app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));

  test(`Category names are "Программирование", "Музыка", "Путешествия", "Кино"`,
    () => expect(response.body.map((it) => it.name)).toEqual(

          expect.arrayContaining([`Программирование`, `Музыка`, `Путешествия`, `Кино`])
      )
  );

});

describe(`API creates a new category if data is valid`, () => {
  const newCategory = {
    name: "correct category name"
  };

  let response;
  let app;

  beforeAll(async () => {
    const {accessToken, refreshToken} = makeTokens({id: 1});
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .post(`/categories/add`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newCategory);;
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Categories count is changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body.length).toBe(5))
  );

});

describe(`API refuses to create a new category without authorization`, () => {
  const newCategory = {
    name: "correct category name"
  };

  let response;
  let app;

  beforeAll(async () => {
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .post(`/categories/add`)
      .set('authorization', `Bearer `) 
      .send(newCategory);;
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));

});

describe(`API refuses to create a new category if data is invalid`, () => {
  const newCategory = {
    name: "мало"
  };

  let response;
  let app;

  beforeAll(async () => {
    const {accessToken, refreshToken} = makeTokens({id: 1});
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .post(`/categories/add`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newCategory);;
  });

  test(`Status code 400 if category name is too short`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

});

describe(`API correctly changes category name`, () => {
  const newCategory = {
    name: "new name"
  };

  let response;
  let app;

  beforeAll(async () => {
    const {accessToken, refreshToken} = makeTokens({id: 1});
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .put(`/categories/1`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newCategory);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Category name changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body[0].name).toBe(`new name`))
  );


});

describe(`API refuses to change category name without authorization`, () => {
  const newCategory = {
    name: "new name"
  };

  let response;
  let app;

  beforeAll(async () => {
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .put(`/categories/1`)
      .set('authorization', `Bearer `) 
      .send(newCategory);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));

  test(`Category name doesnt changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body[0].name).toBe(`Программирование`))
  );

});

describe(`API refuses to change category name if data is invalid`, () => {
  const newCategory = {
    name: "too long category name 123123123123123123123123123123123"
  };

  let response;
  let app;

  beforeAll(async () => {
    const {accessToken, refreshToken} = makeTokens({id: 1});
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .put(`/categories/1`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newCategory);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  test(`Category name doesnt changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body[0].name).toBe(`Программирование`))
  );

});

describe(`API correctly deletes a category`, () => {

  let response;
  let app;

  beforeAll(async () => {
    const {accessToken, refreshToken} = makeTokens({id: 1});
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .delete(`/categories/3`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Categories count is changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

describe(`API refuses to delete a category without authorization`, () => {

  let response;
  let app;

  beforeAll(async () => {
  	app = express();
  	app.use(express.json());
  	await initDB(mockDB, mockCategories, mockArticles, []);
    category(app, new DataService(mockDB));
    response = await request(app)
      .delete(`/categories/3`)
      .set('authorization', `Bearer `) 
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));
  test(`Categories count is not changed`, () => request(app)
    .get(`/categories`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});
