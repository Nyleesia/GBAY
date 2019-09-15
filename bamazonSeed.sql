CREATE TABLE products (
  item_id  INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price  DECIMAL(10,4) NOT NULL,
  stock_quantity INTEGER (10) NOT NULL, 
  PRIMARY KEY (item_id)
);

SELECT * FROM products; 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("hair pins", "beauty", 1.50, 100); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("aprons", "kitchen", 5.00, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("lip gloss", "beauty", 2.00, 75); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("oven mitts", "kitchen", 4.00, 50);  

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("nail varnish", "beauty", 3.00, 50); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("smart bulbs", "lighting", 15.00, 80); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("2b pencils", "stationary", 0.50, 500); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LED light strips", "lighting", 5.00, 120); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("notebooks", "stationary", 7.50, 100); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("candles", "lighting", 2.50, 300); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("dog beds", "pet supplies", 39.00, 30); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("lipstick", "beauty", 9.00, 50); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("biscuity pets", "pet supplies", 5.00, 90); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("dog crates", "pet supplies", 50.00, 20); 

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("aquariums", "pet supplies", 75.00, 15);

SELECT * FROM products; 