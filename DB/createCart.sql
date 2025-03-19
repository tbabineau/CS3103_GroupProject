DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
  userId INT NOT NULL AUTO_INCREMENT,
  itemId INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (userId, itemId),
  FOREIGN KEY (userId) 
	REFERENCES users (userId), 
  FOREIGN KEY (itemId) 
	REFERENCES storeItems (itemId)
);