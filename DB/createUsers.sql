DROP TABLE IF EXISTS users;
CREATE TABLE users (
  userId INT NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  fname varchar(255) NOT NULL,
  lname varchar(255) NOT NULL,
  password_hash varchar(128) NOT NULL,
  salt varchar(32) NOT NULL,
  login_attempts INT NOT NULL DEFAULT(0),
  last_login datetime,
  PRIMARY KEY (userId)
);