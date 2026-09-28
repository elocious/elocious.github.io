import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
import { api } from '../api/client.js';
import Modal from '../components/Modal.jsx';

const STATUS_COLORS = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444' };
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer_id: '', items: [{ product_id: '', quantity: 1 }] });

  const load = async () => {
    try {
      const [ord, prod, cust] = await Promise.all([api.getOrders(), api.getProducts(), api.getCustomers()]);
      setOrders(ord);
      setProducts(prod);
      setCustomers(cust);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAutoAdvance = async () => {
    try {
      await api.autoAdvanceOrders();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this order?')) return;
    try {
      await api.deleteOrder(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const items = newOrder.items.filter((i) => i.product_id);
    if (!newOrder.customer_id || items.length === 0) {
      setError('Select a customer and at least one product');
      return;
    }
    try {
      await api.createOrder({ customer_id: parseInt(newOrder.customer_id), items: items.map((i) => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) })) });
      setShowModal(false);
      setNewOrder({ customer_id: '', items: [{ product_id: '', quantity: 1 }] });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const addItem = () => setNewOrder({ ...newOrder, items: [...newOrder.items, { product_id: '', quantity: 1 }] });
  const updateItem = (idx, field, val) => {
    const items = [...newOrder.items];
    items[idx] = { ...items[idx], [field]: val };
    setNewOrder({ ...newOrder, items });
  };
  const removeItem = (idx) => setNewOrder({ ...newOrder, items: newOrder.items.filter((_, i) => i !== idx) });

  if (loading) return <div className="page"><p className="loading">Loading orders…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p className="page-subtitle">Manage and automate order fulfillment</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleAutoAdvance}><Zap size={16} /> Auto-Advance</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Order</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <table className="data-table full">
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Created</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="mono">#{o.id}</td>
              <td>{o.customer_name || '—'}</td>
              <td>{o.items ? o.items.length : 0} item(s)</td>
              <td>${parseFloat(o.total).toFixed(2)}</td>
              <td>
                <select
                  className="status-select"
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  style={{ borderColor: STATUS_COLORS[o.status] }}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
              <td className="action-cell">
                <button className="btn-icon danger" onClick={() => handleDelete(o.id)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title="Create Order" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="modal-form">
            <label>
              Customer
              <select value={newOrder.customer_id} onChange={(e) => setNewOrder({ ...newOrder, customer_id: e.target.value })} required>
                <option value="">Select customer…</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <div className="order-items">
              <span className="field-label">Items</span>
              {newOrder.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <select value={item.product_id} onChange={(e) => updateItem(idx, 'product_id', e.target.value)} required>
                    <option value="">Select product…</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name} (${parseFloat(p.price).toFixed(2)}, stock: {p.stock})</option>)}
                  </select>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} className="qty-input" />
                  {newOrder.items.length > 1 && (
                    <button type="button" className="btn-icon danger" onClick={() => removeItem(idx)}><Trash2 size={14} /></button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-ghost btn-sm" onClick={addItem}><Plus size={14} /> Add Item</button>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Order</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
