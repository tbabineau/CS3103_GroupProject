DROP TABLE IF EXISTS verifiedUsers;
CREATE TABLE verifiedUsers (
  userId INT NOT NULL,
  PRIMARY KEY (userId),
  FOREIGN KEY (userId)
	REFERENCES users (userID)
);