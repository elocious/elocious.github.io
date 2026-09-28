import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, AlertTriangle } from 'lucide-react';
import { api } from '../api/client.js';
import Modal from '../components/Modal.jsx';

const emptyForm = { name: '', description: '', price: '', stock: '', low_stock_threshold: '10', category: 'General', sku: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    try {
      setProducts(await api.getProducts());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, low_stock_threshold: p.low_stock_threshold, category: p.category, sku: p.sku || '' });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.updateProduct(editId, { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), low_stock_threshold: parseInt(form.low_stock_threshold) });
      } else {
        await api.createProduct({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock), low_stock_threshold: parseInt(form.low_stock_threshold) });
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="page"><p className="loading">Loading products…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="page-subtitle">Manage your inventory</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Product</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <table className="data-table full">
        <thead>
          <tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const isLow = p.stock <= p.low_stock_threshold;
            return (
              <tr key={p.id}>
                <td className="mono">{p.sku || '—'}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${parseFloat(p.price).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  {isLow ? (
                    <span className="badge" style={{ background: '#ef4444' }}>
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  ) : (
                    <span className="badge" style={{ background: '#22c55e' }}>In Stock</span>
                  )}
                </td>
                <td className="action-cell">
                  <button className="btn-icon" onClick={() => openEdit(p)}><Edit2 size={16} /></button>
                  <button className="btn-icon danger" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editId ? 'Edit Product' : 'Add Product'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></label>
            <div className="form-row">
              <label>Price ($)<input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
              <label>Stock<input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
            </div>
            <div className="form-row">
              <label>Low Stock Threshold<input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} /></label>
              <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
            </div>
            <label>SKU<input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></label>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
