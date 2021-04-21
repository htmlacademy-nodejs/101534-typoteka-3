'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const UserService = require(`../data-service/user`);
const {HttpCode} = require(`../../constants`);

const {makeTokens} = require(`../lib/jwt-helper`);

const mockCategories = [
  `Программирование`,
  `Путешествия`,
  `Кино`,
  `Музыка`
];

const mockData = JSON.stringify([
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
  await initDB(mockDB, mockCategories, mockData, mockUsers);
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB), new UserService(mockDB));
  return app;
};


describe(`API returns a list of all articles`, () => {

  let app;

  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's title equals "Финал на краю вселенной"`, () => expect(response.body[0].title).toBe(`Финал на краю вселенной`));

});

describe(`API returns an article with given id`, () => {

  let app;

  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Финал на краю вселенной"`, () => expect(response.body.title).toBe(`Финал на краю вселенной`));

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    "title": `Заголовок новой статьи с огромным количеством символов`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": ['2']
  };
  let app;
  let response;

  beforeAll(async () => {
    const {accessToken, refreshToken} = makeTokens({id: 1});
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newArticle);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article without authorization`, () => {

  const newArticle = {
    "title": `Заголовок новой статьи с огромным количеством символов`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": ['2']
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });


  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));

});


describe(`API refuses to create an article if data is invalid`, () => {

  let newArticle = {
    "title": `мелкий заголовок`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": ['2']
  };
  let app;

  const {accessToken, refreshToken} = makeTokens({id: 1});

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`API returns code 400 if title length is not enough`, async () => {

    await request(app)
      .post(`/articles`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newArticle)
      .expect(HttpCode.BAD_REQUEST)
  });

  newArticle = {
    "title": `Заголовок новой статьи с огромным количеством символов`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": []
  };

  test(`API returns code 400 if categories have no children`, async () => {

    await request(app)
      .post(`/articles`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newArticle)
      .expect(HttpCode.BAD_REQUEST)
  });

  newArticle = {
    "title": `Заголовок новой статьи с огромным количеством символов`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.exe`,
    "categories": ['1']
  };

  test(`API returns code 400 if picture has wrong extension`, async () => {

    await request(app)
      .post(`/articles`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newArticle)
      .expect(HttpCode.BAD_REQUEST)
  });

  newArticle = {
    "title": `Заголовок новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": ['1']
  };

  test(`API returns code 400 if announce field doesnt exist`, async () => {

    await request(app)
      .post(`/articles`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newArticle)
      .expect(HttpCode.BAD_REQUEST)
  });

});

describe(`API changes existent article`, () => {

  const newArticle = {
    "title": `Измененный заголовок статьи с огромным количеством символов`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": ['2']
  };
  let app;
  let response;

  const {accessToken, refreshToken} = makeTokens({id: 1});

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Измененный заголовок статьи с огромным количеством символов`))
  );

});

describe(`API refuses to change existent article without authorization`, () => {

  const newArticle = {
    "title": `Измененный заголовок статьи с огромным количеством символов`,
    "announce": `анонс новой статьи с огромным количеством символов`,
    "text": `Новая статья`,
    "picture": `Image.jpg`,
    "categories": ['2']
  };
  let app;
  let response;


  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));

});

test(`API returns status code 404 when trying to change non-existent article`, async () => {

  const app = await createAPI();

  const validArticle = {
    "title": `Измененная статья`,
    "createdDate": `18.02.2021`,
    "announce": `Новая статья`,
    "fullText": `Новая статья`,
    "category": [
      `Кино`
    ],
    "picture": `Image.jpg`,
    "comments": []
  };

  const {accessToken, refreshToken} = makeTokens({id: 1});

  return request(app)
    .put(`/articless/NOEXST`)
    .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {

  const app = await createAPI();

  const invalidArticle = {
    "title": `мало символов`,
    "createdDate": `18.02.2021`,
    "fullText": `Новая статья`,
    "category": [
      `Кино`
    ],
    "picture": `не картинка`,
  };

  const {accessToken, refreshToken} = makeTokens({id: 1});

  return request(app)
    .put(`/articles/2`)
    .set('authorization', `Bearer ${accessToken} ${refreshToken}`) 
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  let app;

  let response;

  const {accessToken, refreshToken} = makeTokens({id: 1});

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/2`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) ;
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body).toBe(true));

  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => {
      expect(res.body.length).toBe(4);
    })
  );

});

test(`API refuses to delete non-existent article`, async () => {

  const app = await createAPI();
  const {accessToken, refreshToken} = makeTokens({id: 1});

  return request(app)
    .delete(`/articles/NOEXST`)
    .set('authorization', `Bearer ${accessToken} ${refreshToken}`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete an article without authorization`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .set('authorization', ``)
    .expect(HttpCode.UNAUTHORIZED);

});

describe(`API returns a list of comments to given article`, () => {

  let app;

  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 1 comments`, () => {
    expect(response.body.length).toBe(1)
  });

  test(`First comment's id is "Совсем немного... Согласен с автором!"`, () => expect(response.body[0].text).toBe(`Совсем немного... Согласен с автором!`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/1/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => {
      expect(res.body.length).toBe(2)
    })
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async() => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

test(`API refuses to create a comment when comment's length is not enough, and returns status code 400`, async() => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({text: `мало`})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  let app;

  let response;

  const {accessToken, refreshToken} = makeTokens({id: 1});

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/comments/1`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body).toBe(true));

  test(`Comments count is 0 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(0))
  );

});

test(`API refuses to delete comment without authorization`, async () => {

  const app = await createAPI();
  const {accessToken, refreshToken} = makeTokens({id: 1});

  return request(app)
    .delete(`/articles/comments/NOEXST`)
    .set('authorization', ``)
    .expect(HttpCode.UNAUTHORIZED);

});

test(`API refuses to delete non-existent comment`, async () => {

  const app = await createAPI();
  const {accessToken, refreshToken} = makeTokens({id: 1});

  return request(app)
    .delete(`/articles/comments/NOEXST`)
    .set('authorization', `Bearer ${accessToken} ${refreshToken}`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, async () => {

  const app = await createAPI();
  const {accessToken, refreshToken} = makeTokens({id: 1});

  return request(app)
    .delete(`/articles/NOEXST/comments/1`)
    .set('authorization', `Bearer ${accessToken} ${refreshToken}`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API refuses to return an articles page without authorization`, () => {

  let app;

  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/user`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));

});

describe(`API returns an articles page with authorization`, () => {

  let app;

  let response;
  const {accessToken, refreshToken} = makeTokens({id: 1});

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/user`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) ;
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

});

describe(`API refuses to return comments page without authorization`, () => {

  let app;

  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/user/comments`);
  });

  test(`Status code 401`, () => expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED));

});

describe(`API returns comments page with authorization`, () => {

  let app;

  let response;
  const {accessToken, refreshToken} = makeTokens({id: 1});

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/user/comments`)
      .set('authorization', `Bearer ${accessToken} ${refreshToken}`) ;
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

});
