const express = require('express');
const pool = require('../db');

const router = express.Router();

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_FLOW = { pending: 'processing', processing: 'shipped', shipped: 'delivered' };

// GET all orders with customer name and item count
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT o.*, c.name AS customer_name,
        (SELECT json_agg(json_build_object(
          'product_id', oi.product_id, 'product_name', p.name,
          'quantity', oi.quantity, 'price', oi.price
        ))
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = o.id) AS items
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// CREATE order — automatically decrements stock in a transaction
router.post('/', async (req, res, next) => {
  const { customer_id, items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'Order must have at least one item' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total = 0;
    const enrichedItems = [];

    for (const item of items) {
      const productResult = await client.query('SELECT price, stock, name FROM products WHERE id = $1', [item.product_id]);
      if (productResult.rows.length === 0) throw new Error(`Product ${item.product_id} not found`);
      const product = productResult.rows[0];
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for "${product.name}" (available: ${product.stock})`);
      const lineTotal = parseFloat(product.price) * item.quantity;
      total += lineTotal;
      enrichedItems.push({ product_id: item.product_id, name: product.name, quantity: item.quantity, price: product.price });
    }

    const orderResult = await client.query(
      'INSERT INTO orders (customer_id, status, total) VALUES ($1, $2, $3) RETURNING *',
      [customer_id, 'pending', total]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of enrichedItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');

    const fullOrder = await pool.query(`
      SELECT o.*, c.name AS customer_name FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id WHERE o.id = $1
    `, [orderId]);

    res.status(201).json({ ...fullOrder.rows[0], items: enrichedItems });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// UPDATE order status (manual)
router.patch('/:id/status', async (req, res, next) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    // If cancelling, restock items
    if (status === 'cancelled') {
      const order = await pool.query('SELECT status FROM orders WHERE id = $1', [req.params.id]);
      if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      if (order.rows[0].status !== 'cancelled') {
        const items = await pool.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [req.params.id]);
        for (const item of items.rows) {
          await pool.query('UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2', [item.quantity, item.product_id]);
        }
      }
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// AUTO-ADVANCE: advance all pending orders to processing, processing to shipped, shipped to delivered
router.post('/auto-advance', async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const advanced = [];

    for (const [from, to] of Object.entries(STATUS_FLOW)) {
      const result = await client.query(
        `UPDATE orders SET status = $1, updated_at = NOW() WHERE status = $2 RETURNING id`,
        [to, from]
      );
      for (const row of result.rows) {
        advanced.push({ id: row.id, from, to });
      }
    }

    await client.query('COMMIT');
    res.json({ advanced, count: advanced.length });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// DELETE order
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
