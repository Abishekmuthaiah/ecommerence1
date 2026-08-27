import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isDiscounted = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);
  const currentPrice = isDiscounted ? parseFloat(product.discount_price) : parseFloat(product.price);
  const originalPrice = parseFloat(product.price);
  const discountPercent = isDiscounted
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        transition: 'var(--transition)',
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '75%',
        background: 'var(--bg-surface-elevated)',
        overflow: 'hidden',
        borderTopLeftRadius: 'calc(var(--radius-md) - 1px)',
        borderTopRightRadius: 'calc(var(--radius-md) - 1px)',
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="product-img"
          loading="lazy"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          zIndex: 2,
        }}>
          {isDiscounted && (
            <span className="badge badge-rose" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
              Save {discountPercent}%
            </span>
          )}
          {product.is_featured && (
            <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
              Featured
            </span>
          )}
        </div>

        {/* Quick View Floating Button */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'var(--bg-surface-glass)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
            transition: 'var(--transition)',
          }}
          title="View Details"
        >
          <Eye size={15} />
        </div>
      </div>

      {/* Details Container */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        {/* Category & Stock Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {product.category}
          </span>
          {isOutOfStock ? (
            <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>Out of Stock</span>
          ) : product.stock <= 5 ? (
            <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>Only {product.stock} left</span>
          ) : (
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>In Stock</span>
          )}
        </div>

        {/* Product Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.015em',
          margin: '0.1rem 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.5rem',
          lineHeight: 1.35,
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
          <Star size={14} fill="#FF9F0A" color="#FF9F0A" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.rating || 4.8}</span>
          <span style={{ color: 'var(--text-muted)' }}>({product.num_reviews || 24})</span>
        </div>

        {/* Price & Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
              ₹{currentPrice.toFixed(2)}
            </span>
            {isDiscounted && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ padding: '0.4rem 0.95rem' }}
          >
            <ShoppingBag size={14} />
            {isOutOfStock ? 'Sold' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  );
}
