"use strict";

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({comments, offset, limit} = {}) {
    return this._load(`/articles`, {params: {comments, offset, limit}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  dropArticle(id, token) {
    return this._load(`/articles/${id}`, {
      method: `DELETE`,
      headers: {authorization: token}
    });
  }

  getArticlesByUser(token) {
    return this._load(`/articles/user`, {
      headers: {authorization: token}
    });
  }

  getCommentsByUser(token) {
    return this._load(`/articles/user/comments`, {
      headers: {authorization: token}
    });
  }

  getComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  dropComment(id, token) {
    return this._load(`/articles/comments/${id}`, {
      method: `DELETE`,
      headers: {authorization: token}
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async getCategoriesByUser(user, token) {
    return this._load(`/categories/user/${user.id}`, {
      headers: {authorization: token}
    });
  }

  async createCategory(data, token) {
    return this._load(`/categories/add`, {
      method: `POST`,
      data,
      headers: {authorization: token}
    });
  }

  async createArticle(data, token) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
      headers: {authorization: token}
    });
  }

  async createComment(id, commentData) {
    return this._load(`/articles/${id}/comments`, {
      method: `POST`,
      data: commentData
    });
  }

  async createUser(userData) {
    return this._load(`/user`, {
      method: `POST`,
      data: userData
    });
  }

  async login(userData) {
    return this._load(`/user/auth`, {
      method: `POST`,
      data: userData
    });
  }

  async logout(token) {
    return this._load(`/user/logout`, {
      method: `DELETE`,
      headers: {authorization: token}
    });
  }

  async updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  async checkAuth(token) {
    return this._load(`/user/checkauth`, {
      headers: {authorization: token}
    });
  }

  async refresh(token) {
    return this._load(`/user/refresh`, {
      method: `POST`,
      headers: {authorization: token}
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  api: API,
  getAPI: () => defaultAPI
};
