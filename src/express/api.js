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

  getArticlesByUser(token) {
    return this._load(`/articles/user`, {
      headers: {authorization: token}
    });
  }

  getComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
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

  async updateArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  api: API,
  getAPI: () => defaultAPI
};
