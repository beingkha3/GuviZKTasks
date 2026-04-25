-- ecommerce database script

CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO customers (name, email, address)
VALUES
('John Doe', 'john@example.com', 'Mumbai, India'),
('Jane Smith', 'jane@example.com', 'Delhi, India'),
('Rahul Sharma', 'rahul@example.com', 'Pune, India'),
('Aisha Khan', 'aisha@example.com', 'Bangalore, India');

INSERT INTO products (name, price, description)
VALUES
('Product A', 120.00, 'This is Product A'),
('Product B', 80.00, 'This is Product B'),
('Product C', 40.00, 'This is Product C'),
('Product D', 200.00, 'This is Product D'),
('Product E', 150.00, 'This is Product E');

INSERT INTO orders (customer_id, order_date, total_amount)
VALUES
(1, CURDATE() - INTERVAL 5 DAY, 200.00),
(2, CURDATE() - INTERVAL 10 DAY, 120.00),
(3, CURDATE() - INTERVAL 40 DAY, 80.00),
(1, CURDATE() - INTERVAL 2 DAY, 320.00),
(4, CURDATE() - INTERVAL 15 DAY, 150.00);

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 1, 1, 120.00),
(1, 2, 1, 80.00),
(2, 1, 1, 120.00),
(3, 2, 1, 80.00),
(4, 1, 2, 120.00),
(4, 3, 2, 40.00),
(5, 5, 1, 150.00);

-- customers who ordered in the last 30 days
SELECT DISTINCT c.*
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= CURDATE() - INTERVAL 30 DAY;

-- total order amount per customer
SELECT 
    c.name,
    SUM(o.total_amount) AS total_order_amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;

-- update price for Product C
UPDATE products
SET price = 45.00
WHERE name = 'Product C';

-- add discount column on products
ALTER TABLE products
ADD COLUMN discount DECIMAL(5,2) DEFAULT 0.00;

-- top 3 most expensive products
SELECT *
FROM products
ORDER BY price DESC
LIMIT 3;

-- customers who bought Product A
SELECT DISTINCT c.name
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.name = 'Product A';

-- order dates with customer names
SELECT 
    c.name AS customer_name,
    o.order_date
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- orders above 150 total
SELECT *
FROM orders
WHERE total_amount > 150.00;

-- show each order item and item total
SELECT 
    o.id AS order_id,
    c.name AS customer_name,
    p.name AS product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS item_total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
ORDER BY o.id;

-- average order total
SELECT AVG(total_amount) AS average_order_total
FROM orders;

-- calculate order totals from order_items
SELECT 
    o.id AS order_id,
    c.name AS customer_name,
    SUM(oi.quantity * oi.price) AS calculated_total
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.name;
