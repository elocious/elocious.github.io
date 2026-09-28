const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET all products
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET single product
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// CREATE product
router.post('/', async (req, res, next) => {
  const { name, description, price, stock, low_stock_threshold, category, sku } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, low_stock_threshold, category, sku)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description || '', price, stock || 0, low_stock_threshold || 10, category || 'General', sku]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// UPDATE product
router.put('/:id', async (req, res, next) => {
  const { name, description, price, stock, low_stock_threshold, category, sku } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name = $1, description = $2, price = $3, stock = $4,
       low_stock_threshold = $5, category = $6, sku = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, description, price, stock, low_stock_threshold, category, sku, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE product
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
