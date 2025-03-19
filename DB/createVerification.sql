DROP TABLE IF EXISTS verification;
CREATE TABLE verification (
  userId INT NOT NULL,
  verificationHash varchar(256) NOT NULL,
  timeStamp datetime,
  PRIMARY KEY (userId)
);