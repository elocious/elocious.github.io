import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Clock, Package, Users, AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../api/client.js';
import StatCard from '../components/StatCard.jsx';

const STATUS_COLORS = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };
const PIE_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api.getDashboard();
      setStats(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAutoAdvance = async () => {
    try {
      await api.autoAdvanceOrders();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="page"><div className="error-banner">{error}</div></div>;
  if (!stats) return <div className="page"><p className="loading">Loading dashboard…</p></div>;

  const revenueData = stats.revenueByDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: parseFloat(d.revenue),
  }));

  const pieData = stats.ordersByStatus.map((s) => ({ name: s.status, value: parseInt(s.count) }));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your store performance</p>
        </div>
        <button className="btn btn-primary" onClick={handleAutoAdvance}>
          <Zap size={16} /> Auto-Advance Orders
        </button>
      </div>

      <div className="stats-grid">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} accent="green" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} accent="blue" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} accent="orange" />
        <StatCard icon={Package} label="Products" value={stats.totalProducts} accent="purple" />
        <StatCard icon={Users} label="Customers" value={stats.totalCustomers} accent="cyan" />
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={20} />
          <span>{stats.lowStockProducts.length} product(s) are low on stock — restock soon!</span>
        </div>
      )}

      <div className="charts-row">
        <div className="chart-card">
          <h3><TrendingUp size={18} /> Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dual-panel">
        <div className="panel">
          <h3>Recent Orders</h3>
          <table className="data-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer_name || '—'}</td>
                  <td><span className="badge" style={{ background: STATUS_COLORS[o.status] }}>{o.status}</span></td>
                  <td>${parseFloat(o.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3><AlertTriangle size={18} /> Low Stock Alerts</h3>
          {stats.lowStockProducts.length === 0 ? (
            <p className="empty-state">All products are well stocked.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Stock</th><th>Threshold</th></tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td className="stock-low">{p.stock}</td>
                    <td>{p.low_stock_threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
