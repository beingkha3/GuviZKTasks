# E-Commerce MySQL Database Task

This repository contains a simple MySQL database task for an e-commerce system.

## Database Name

```sql
ecommerce
```

## Files Included

- `ecommerce.sql` - Contains the full MySQL script for database creation, table creation, sample data insertion, normalization, and all required queries.

## Tables Created

The database includes the following tables:

1. `customers`
2. `products`
3. `orders`
4. `order_items`

The `order_items` table is added for database normalization so that each order can contain multiple products.

## Table Relationships

```text
customers → orders → order_items → products
```

## Features Covered

- Create database named `ecommerce`
- Create required tables
- Insert sample data
- Use primary keys and foreign keys
- Retrieve customers based on order dates
- Calculate total order amounts per customer
- Update product price
- Add a new discount column
- Retrieve top 3 highest-priced products
- Find customers who ordered a specific product
- Join customers and orders
- Filter orders by total amount
- Normalize order data using `order_items`
- Calculate average order total

## How to Run

1. Open MySQL Workbench, phpMyAdmin, or any MySQL client.
2. Open the `ecommerce.sql` file.
3. Run the full script.
4. The script will create the database, tables, sample data, and execute all required queries.

## Required Queries Included

All required queries are written at the bottom of the `ecommerce.sql` file under the section:

```sql
-- 5. REQUIRED QUERIES
```

## Notes

The script includes:

- `CREATE DATABASE IF NOT EXISTS ecommerce`
- `DROP TABLE IF EXISTS` statements so the script can be safely re-run
- MySQL-compatible syntax
