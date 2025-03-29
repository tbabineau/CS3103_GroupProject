DELIMITER //
DROP PROCEDURE IF EXISTS addItem //
CREATE PROCEDURE addItem
(
   IN itemName varchar(255),
	  itemDescription varchar(255),
      itemPrice decimal(7, 2),
      itemStock INT
)
BEGIN
   INSERT INTO storeItems (itemName, itemDescription, itemPrice, itemStock, itemPhoto) VALUES (itemName, itemDescription, itemPrice, itemStock, "TEMP");

    /* If the INSERT is successful, then this will return the Id for the record */
    SELECT LAST_INSERT_ID(); /* Specific to this session */

END //
DELIMITER ;
