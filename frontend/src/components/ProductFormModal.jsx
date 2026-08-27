import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { Save, Plus } from 'lucide-react';

export default function ProductFormModal({ isOpen, onClose, onSubmit, initialData = null, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    discount_price: '',
    stock: '10',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    rating: '4.8',
    description: '',
    is_featured: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Electronics',
        price: initialData.price !== undefined ? initialData.price.toString() : '',
        discount_price: initialData.discount_price !== undefined && initialData.discount_price !== null ? initialData.discount_price.toString() : '',
        stock: initialData.stock !== undefined ? initialData.stock.toString() : '0',
        image: initialData.image || '',
        rating: initialData.rating !== undefined ? initialData.rating.toString() : '4.5',
        description: initialData.description || '',
        is_featured: !!initialData.is_featured,
      });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.name || 'Electronics',
        price: '',
        discount_price: '',
        stock: '25',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        rating: '4.8',
        description: '',
        is_featured: false,
      });
    }
  }, [initialData, categories, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Product: ${initialData.name}` : 'Add New Product'}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. UltraSound ANC Headphones"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Stock Units *</label>
            <input
              type="number"
              name="stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Regular Price (₹) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              min="0"
              placeholder="999.00"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Discount Price (₹) (Optional)</label>
            <input
              type="number"
              step="0.01"
              name="discount_price"
              min="0"
              placeholder="799.00"
              value={formData.discount_price}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL *</label>
          <input
            type="url"
            name="image"
            required
            placeholder="https://images.unsplash.com/photo-..."
            value={formData.image}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Key product specifications, ergonomics, battery endurance, compatibility..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
            />
            Mark as Featured Product on Homepage
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Save size={18} /> {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
