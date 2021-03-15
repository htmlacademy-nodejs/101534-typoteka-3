/*Получает список всех категорий*/

SELECT * FROM categories

/*Получает список категорий для которых создана минимум одна публикация*/

SELECT id, name FROM categories
  JOIN article_categories
  ON id = category_id
  GROUP BY id

/*Получает список категорий с количеством публикаций*/

SELECT id, name, count(article_id) FROM categories
  LEFT JOIN article_categories
  ON id = category_id
  GROUP BY id

/*Получает список всех публикация, снчала отображает свежие*/

SELECT articles.*, 
  COUNT(comments.id) AS comments_count, 
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC

/*Получает полную информацию определённой публикации*/

SELECT articles.*, 
  COUNT(comments.id) AS comments_count, 
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM articles
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON comments.article_id = articles.id
  JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id

/*Получает пять свежих комментариев*/

SELECT 
  comments.id, 
  comments.article_id, 
  users.first_name, 
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_at DESC
  LIMIT 5

/*Получает список комментариев для определённой публикации, сначала свежие*/

SELECT 
  comments.id, 
  comments.article_id, 
  users.first_name, 
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
  ORDER BY comments.created_at DESC

/*Обновляет заголовок определенной публикации*/

UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1
