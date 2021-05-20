CREATE DATABASE typoteka
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
GRANT ALL ON DATABASE typoteka TO dagda25;

CREATE TABLE categories(
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" varchar(255) NOT NULL,
  "createdAt" timestamp DEFAULT current_timestamp,
  "updatedAt" timestamp DEFAULT current_timestamp
);

CREATE TABLE users(
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "email" varchar(255) UNIQUE NOT NULL,
  "password" varchar(255) NOT NULL,
  "token" varchar(255),
  "firstName" varchar(255) NOT NULL,
  "lastName" varchar(255) NOT NULL,
  "avatar" varchar(50) NOT NULL,
  "createdAt" timestamp DEFAULT current_timestamp,
  "updatedAt" timestamp DEFAULT current_timestamp
);

CREATE TABLE articles(
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "title" varchar(255) NOT NULL,
  "announce" text NOT NULL,
  "text" text NOT NULL,
  "picture" varchar(50),
  "userId" integer NOT NULL,
  "createdAt" timestamp DEFAULT current_timestamp,
  "updatedAt" timestamp DEFAULT current_timestamp,
  FOREIGN KEY ("userId") REFERENCES users(id)
);

CREATE TABLE comments(
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "articleId" integer NOT NULL,
  "userId" integer NOT NULL,
  "text" text NOT NULL,
  "createdAt" timestamp DEFAULT current_timestamp,
  "updatedAt" timestamp DEFAULT current_timestamp,
  FOREIGN KEY ("userId") REFERENCES users(id),
  FOREIGN KEY ("articleId") REFERENCES articles(id)
);

CREATE TABLE article_categories(
  "ArticleId" integer NOT NULL,
  "CategoryId" integer NOT NULL,
  "createdAt" timestamp DEFAULT current_timestamp,
  "updatedAt" timestamp DEFAULT current_timestamp,
  PRIMARY KEY ("ArticleId", "CategoryId"),
  FOREIGN KEY ("ArticleId") REFERENCES articles(id),
  FOREIGN KEY ("CategoryId") REFERENCES categories(id)
);

ALTER TABLE categories OWNER TO dagda25;
ALTER TABLE articles OWNER TO dagda25;
ALTER TABLE article_categories OWNER TO dagda25;
ALTER TABLE comments OWNER TO dagda25;
ALTER TABLE users OWNER TO dagda25;
