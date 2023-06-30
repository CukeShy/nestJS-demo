CREATE DATABASE IF NOT EXISTS dev_local DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dev_local;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
  username VARCHAR(20),
  nickname VARCHAR(20),
  mobile CHAR(11),
  avatar_url varchar(200),
  is_vip BOOLEAN NOT NULL DEFAULT false,
  is_designer BOOLEAN NOT NULL DEFAULT false,
  wechat_openid varchar(50),
  wechat_image varchar(200),
  wechat_nickname varchar(30)
);

CREATE TABLE IF NOT EXISTS user_auths (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  user_id CHAR(32),
  user_salt CHAR(12),
  user_hash CHAR(64)
);