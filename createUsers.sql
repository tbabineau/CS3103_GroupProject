DROP TABLE IF EXISTS users;
CREATE TABLE users (
  userId INT NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  email varchar(50) NOT NULL,
  fname varchar(50) NOT NULL,
  lname varchar(50) NOT NULL,
  password_hash varchar(256) NOT NULL,
  salt varchar(50) NOT NULL,
  login_attempts INT NOT NULL,
  last_login datetime,
  PRIMARY KEY (userId)
);