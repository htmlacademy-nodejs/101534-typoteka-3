'use strict';

const socket = io();

const formatAnnounce = (text) => {
  if (text.length <= 100) {
    return text
  } else {
    return text.slice(0, 100) + `...`;
  }
};

const popularArticles = document.querySelector(`.hot__list`);
const recentComments = document.querySelector(`.last__list`);

const showPopularArticles = (mostPopular) => {
  popularArticles.innerHTML = mostPopular.map((article) => {
    return `<li class="hot__list-item">
      <a class="hot__list-link" href="/articles/${article.id}">
        ${formatAnnounce(article.announce)} <sup class="hot__link-sup">${article.comments.length}</sup>
      </a>
    </li>`
  }).join(``);
}

const showRecentComments = (lastComments) => {
  recentComments.innerHTML = lastComments.map((comment) => {
    return `<li class=last__list-item>
        ${comment['User.avatar'] ? `<img class="last__list-image" src=img/avatars/${comment['User.avatar']} width="20" height="20" alt="avatar">` : ``}
        <b class="last__list-name">${comment['User.firstName']} ${comment['User.lastName']}</b>
        <a class="last__list-link" href="/articles/${comment['Article.id']}">${comment.text}</a>
     </li>`}
  ).join(``);
}


socket.addEventListener(`comment`, async (data) => {
  const {articles, comments} = data;

  showPopularArticles(articles);
  showRecentComments(comments);
});
