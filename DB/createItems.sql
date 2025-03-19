DROP TABLE IF EXISTS storeItems;
CREATE TABLE storeItems (
  itemId INT NOT NULL,
  itemName varchar(100) NOT NULL,
  itemDescription varchar(250) NOT NULL,
  itemPrice decimal(7,2) NOT NULL,
  itemStock INT NOT NULL,
  itemPhoto varchar(250) NOT NULL,
  PRIMARY KEY (itemId)
);