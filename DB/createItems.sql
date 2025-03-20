DROP TABLE IF EXISTS storeItems;
CREATE TABLE storeItems (
  itemId INT NOT NULL AUTO_INCREMENT,
  itemName varchar(255) NOT NULL,
  itemDescription varchar(255) NOT NULL,
  itemPrice decimal(7,2) NOT NULL,
  itemStock INT NOT NULL,
  itemPhoto varchar(255) NOT NULL,
  PRIMARY KEY (itemId)
);