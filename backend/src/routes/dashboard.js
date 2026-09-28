const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET dashboard stats
router.get('/', async (req, res, next) => {
  try {
    const totalRevenue = await pool.query(`
      SELECT COALESCE(SUM(total), 0) AS revenue FROM orders WHERE status != 'cancelled'
    `);
    const totalOrders = await pool.query('SELECT COUNT(*) AS count FROM orders');
    const pendingOrders = await pool.query("SELECT COUNT(*) AS count FROM orders WHERE status = 'pending'");
    const totalProducts = await pool.query('SELECT COUNT(*) AS count FROM products');
    const totalCustomers = await pool.query('SELECT COUNT(*) AS count FROM customers');

    const lowStock = await pool.query(`
      SELECT id, name, stock, low_stock_threshold, sku
      FROM products WHERE stock <= low_stock_threshold
      ORDER BY stock ASC
    `);

    const recentOrders = await pool.query(`
      SELECT o.id, o.status, o.total, o.created_at, c.name AS customer_name
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC LIMIT 5
    `);

    const revenueByDay = await pool.query(`
      SELECT DATE(created_at) AS date, SUM(total) AS revenue
      FROM orders WHERE status != 'cancelled'
      GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 7
    `);

    const ordersByStatus = await pool.query(`
      SELECT status, COUNT(*) AS count FROM orders GROUP BY status
    `);

    res.json({
      totalRevenue: parseFloat(totalRevenue.rows[0].revenue),
      totalOrders: parseInt(totalOrders.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count),
      totalProducts: parseInt(totalProducts.rows[0].count),
      totalCustomers: parseInt(totalCustomers.rows[0].count),
      lowStockProducts: lowStock.rows,
      recentOrders: recentOrders.rows,
      revenueByDay: revenueByDay.rows.reverse(),
      ordersByStatus: ordersByStatus.rows,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
