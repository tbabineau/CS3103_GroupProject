DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
  userId INT NOT NULL,
  itemId INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (userId, itemId),
  FOREIGN KEY (userId, itemId)
);