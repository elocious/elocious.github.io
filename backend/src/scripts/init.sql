-- E-commerce Platform Schema

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  category VARCHAR(100) DEFAULT 'General',
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- Seed data
INSERT INTO products (name, description, price, stock, low_stock_threshold, category, sku) VALUES
('Wireless Headphones', 'Bluetooth over-ear headphones with noise cancellation', 79.99, 45, 10, 'Electronics', 'WH-001'),
('Smart Watch', 'Fitness tracking smart watch with heart rate monitor', 129.99, 8, 15, 'Electronics', 'SW-002'),
('Coffee Maker', '12-cup programmable coffee maker', 49.99, 32, 10, 'Home', 'CM-003'),
('Running Shoes', 'Lightweight running shoes for men', 89.99, 60, 20, 'Apparel', 'RS-004'),
('USB-C Cable', 'Braided USB-C to USB-C cable, 2m', 12.99, 5, 25, 'Electronics', 'UC-005'),
('Yoga Mat', 'Non-slip yoga mat with carrying strap', 29.99, 28, 10, 'Fitness', 'YM-006'),
('Desk Lamp', 'LED adjustable desk lamp with USB port', 34.99, 18, 8, 'Home', 'DL-007'),
('Water Bottle', 'Insulated stainless steel water bottle, 750ml', 19.99, 100, 30, 'Fitness', 'WB-008')
ON CONFLICT (sku) DO NOTHING;

INSERT INTO customers (name, email, phone) VALUES
('John Doe', 'john.doe@email.com', '555-0101'),
('Jane Smith', 'jane.smith@email.com', '555-0102'),
('Mike Johnson', 'mike.j@email.com', '555-0103'),
('Sarah Williams', 'sarah.w@email.com', '555-0104'),
('David Brown', 'david.b@email.com', '555-0105')
ON CONFLICT (email) DO NOTHING;

INSERT INTO orders (customer_id, status, total, created_at) VALUES
(1, 'delivered', 79.99, NOW() - INTERVAL '20 days'),
(2, 'delivered', 129.99, NOW() - INTERVAL '15 days'),
(1, 'shipped', 49.99, NOW() - INTERVAL '10 days'),
(3, 'processing', 89.99, NOW() - INTERVAL '5 days'),
(2, 'pending', 12.99, NOW() - INTERVAL '2 days'),
(4, 'pending', 64.98, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 79.99),
(2, 2, 1, 129.99),
(3, 3, 1, 49.99),
(4, 4, 1, 89.99),
(5, 5, 1, 12.99),
(6, 6, 1, 29.99),
(6, 8, 1, 19.99),
(6, 7, 1, 15.98)
ON CONFLICT DO NOTHING;

-- Update stock for orders that have been placed
UPDATE products SET stock = stock - 1 WHERE id = 1;
UPDATE products SET stock = stock - 1 WHERE id = 2;
UPDATE products SET stock = stock - 1 WHERE id = 3;
UPDATE products SET stock = stock - 1 WHERE id = 4;
UPDATE products SET stock = stock - 1 WHERE id = 5;
UPDATE products SET stock = stock - 1 WHERE id = 6;
UPDATE products SET stock = stock - 1 WHERE id = 8;
UPDATE products SET stock = stock - 1 WHERE id = 7;
