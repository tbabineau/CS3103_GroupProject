DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  reviewId INT NOT NULL AUTO_INCREMENT,
  itemId INT NOT NULL,
  userId INT NOT NULL,
  reviewText varchar(250) NOT NULL,
  reviewRating decimal(2,1) NOT NULL,
  PRIMARY KEY (userId)
  FOREIGN KEY (itemId, userId)
);