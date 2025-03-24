DROP TABLE IF EXISTS verification;
DROP TABLE IF EXISTS verifiedUsers;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS storeItems;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  userId INT NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  fname varchar(255) NOT NULL,
  lname varchar(255) NOT NULL,
  password_hash varchar(128) NOT NULL,
  salt varchar(64) NOT NULL,
  login_attempts INT NOT NULL DEFAULT(0),
  last_login datetime,
  manager_flag BOOLEAN,
  PRIMARY KEY (userId)
);

CREATE TABLE storeItems (
  itemId INT NOT NULL AUTO_INCREMENT,
  itemName varchar(255) NOT NULL,
  itemDescription varchar(255) NOT NULL,
  itemPrice decimal(7,2) NOT NULL,
  itemStock INT NOT NULL,
  itemPhoto varchar(255) NOT NULL,
  PRIMARY KEY (itemId)
);

CREATE TABLE cart (
  userId INT NOT NULL AUTO_INCREMENT,
  itemId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (userId, itemId),
  FOREIGN KEY (userId) 
	REFERENCES users (userId), 
  FOREIGN KEY (itemId) 
	REFERENCES storeItems (itemId)
);

CREATE TABLE reviews (
  reviewId INT NOT NULL AUTO_INCREMENT,
  itemId INT NOT NULL,
  userId INT NOT NULL,
  reviewText varchar(255) NOT NULL,
  reviewRating decimal(2,1) NOT NULL,
  PRIMARY KEY (reviewId),
  FOREIGN KEY (itemId)
	REFERENCES storeItems (itemId),
  FOREIGN KEY (userId)
	REFERENCES users (userId)
);

CREATE TABLE verifiedUsers (
  userId INT NOT NULL,
  PRIMARY KEY (userId),
  FOREIGN KEY (userId)
	REFERENCES users (userID)
);

CREATE TABLE verification (
  userId INT NOT NULL,
  verificationHash varchar(128) NOT NULL,
  timeStamp datetime,
  PRIMARY KEY (userId),
  FOREIGN KEY (userId)
	REFERENCES users (userID)
);