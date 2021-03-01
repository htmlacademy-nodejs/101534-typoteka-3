'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `nBJ_f0`,
    "title": `Что такое золотое сечение`,
    "createdDate": `23.01.2021`,
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Сотрясение мозга – очень серьезно. Пора перестать восхищаться теми, кто возвращается в поле после травм головы. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Медведев сейчас так хорош, что обводит даже одноручным бэкхендом. Достичь успеха помогут ежедневные повторения.`,
    "category": [
      `Железо`
    ],
    "comments": [
      {
        "id": `ObtvHr`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `uu9DQH`,
        "text": `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `bYAvBg`,
        "text": `Это где ж такие красоты?`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "id": `ePlvy_`,
    "title": `Биатлон в горах`,
    "createdDate": `20.02.2021`,
    "announce": `Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Собрать камни бесконечности легко, если вы прирожденный герой. Леброн пробежал половину площадки с мячом в руках и забил сверху. Разве это не пробежка? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "category": [
      `Музыка`
    ],
    "comments": [
      {
        "id": `m6hXLy`,
        "text": `Согласен с автором! Совсем немного...`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "id": `R6i-7t`,
    "title": `Учим HTML и CSS`,
    "createdDate": `11.02.2021`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Леброн пробежал половину площадки с мячом в руках и забил сверху. Разве это не пробежка?`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "category": [
      `Образование`
    ],
    "comments": [
      {
        "id": `H2Nfmj`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `tw6OBp`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Хочу такую же футболку :-)`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "id": `kcXzhK`,
    "title": `Обзор новейшего смартфона`,
    "createdDate": `06.01.2021`,
    "announce": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов.`,
    "fullText": `Леброн пробежал половину площадки с мячом в руках и забил сверху. Разве это не пробежка? Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "category": [
      `Путешествия`
    ],
    "comments": [
      {
        "id": `xmI2Nv`,
        "text": `Планируете записать видосик на эту тему? Это где ж такие красоты? Согласен с автором!`
      }
    ],
    "picture": `Image.jpg`
  },
  {
    "id": `sd7J-X`,
    "title": `Учим HTML и CSS`,
    "createdDate": `09.02.2021`,
    "announce": `Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Медведев сейчас так хорош, что обводит даже одноручным бэкхендом.`,
    "category": [
      `Спорт`
    ],
    "comments": [
      {
        "id": `15m7jV`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `hBobdr`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `EHTDvf`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-) Плюсую, но слишком много буквы!`
      },
      {
        "id": `hDZaqN`,
        "text": `Планируете записать видосик на эту тему?`
      }
    ],
    "picture": `Image.jpg`
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};


describe(`API returns a list of all articles`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "nBJ_f0"`, () => expect(response.body[0].id).toBe(`nBJ_f0`));

});

describe(`API returns an article with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/nBJ_f0`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Что такое золотое сечение"`, () => expect(response.body.title).toBe(`Что такое золотое сечение`));

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    "title": `Новая статья`,
    "createdDate": `18.02.2021`,
    "announce": `Новая статья`,
    "fullText": `Новая статья`,
    "category": [
      `Кино`
    ],
    "comments": [],
    "picture": `Image.jpg`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    "title": `Новая статья`,
    "createdDate": `18.02.2021`,
    "announce": `Новая статья`,
    "fullText": `Новая статья`,
    "picture": `Image.jpg`,
    "comments": []
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {

  const newArticle = {
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
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/sd7J-X`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed Article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/sd7J-X`)
    .expect((res) => expect(res.body.title).toBe(`Измененная статья`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

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

  return request(app)
    .put(`/articless/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidArticle = {
    "title": `Измененная статья`,
    "createdDate": `18.02.2021`,
    "fullText": `Новая статья`,
    "category": [
      `Кино`
    ],
    "picture": `Image.jpg`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/R6i-7t`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`R6i-7t`));

  test(`Article count is 5 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => {
      expect(res.body.length).toBe(5);
    })
  );

});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/nBJ_f0/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's id is "ObtvHr"`, () => expect(response.body[0].id).toBe(`ObtvHr`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/nBJ_f0/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/nBJ_f0/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/nBJ_f0/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/nBJ_f0/comments/ObtvHr`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`ObtvHr`));

  test(`Comments count is 2 now`, () => request(app)
    .get(`/articles/nBJ_f0/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/nBJ_f0/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/m6hXLy`)
    .expect(HttpCode.NOT_FOUND);

});
