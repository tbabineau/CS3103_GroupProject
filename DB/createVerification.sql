DROP TABLE IF EXISTS verification;
CREATE TABLE verification (
  userId INT NOT NULL,
  verificationHash varchar(128) NOT NULL,
  timeStamp datetime,
  PRIMARY KEY (userId),
  FOREIGN KEY (userId)
	REFERENCES users (userID)
);