import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertTriangle,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const data = await productService.getProductById(id);
        if (data.success && data.product) {
          setProduct(data.product);
          setQuantity(1);

          // Fetch related products in the same category
          const relData = await productService.getProducts({
            category: data.product.category,
            limit: 4,
          });
          if (relData.success) {
            setRelatedProducts(relData.products.filter((p) => p.id !== parseInt(id, 10)));
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        showToast('Product not found', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '3rem 0' }}>
        <div className="skeleton" style={{ height: '480px', borderRadius: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="skeleton" style={{ height: '30px', width: '30%' }} />
          <div className="skeleton" style={{ height: '45px', width: '80%' }} />
          <div className="skeleton" style={{ height: '30px', width: '40%' }} />
          <div className="skeleton" style={{ height: '120px', width: '100%' }} />
          <div className="skeleton" style={{ height: '55px', width: '100%' }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const isDiscounted = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);
  const currentPrice = isDiscounted ? parseFloat(product.discount_price) : parseFloat(product.price);
  const originalPrice = parseFloat(product.price);
  const savings = isDiscounted ? originalPrice - currentPrice : 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem' }}>
      {/* Breadcrumb / Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
        <button
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          <Share2 size={15} /> Share Product
        </button>
      </div>

      {/* Main Product Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.1fr) 1fr', gap: '3.5rem', alignItems: 'start' }} className="product-details-grid">
        {/* Left: Image Presentation */}
        <div style={{
          position: 'sticky',
          top: '90px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '480px',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Right: Product Info & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header & Badges */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-cyan">{product.category}</span>
              {product.is_featured && <span className="badge badge-indigo">Staff Pick</span>}
              {isDiscounted && <span className="badge badge-rose">Special Offer</span>}
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Rating & Review */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating || 4.5) ? '#F59E0B' : 'transparent'}
                    color="#F59E0B"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{product.rating || 4.5}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.num_reviews || 12} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  ₹{currentPrice.toFixed(2)}
                </span>
                {isDiscounted && (
                  <span style={{ fontSize: '1.15rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {isDiscounted && (
                <p style={{ fontSize: '0.825rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: '0.25rem' }}>
                  Save ₹{savings.toFixed(2)} instantly with current promo discount!
                </p>
              )}
            </div>

            {/* Stock status indicator */}
            <div style={{ textAlign: 'right' }}>
              {isOutOfStock ? (
                <span className="badge badge-rose">
                  <AlertTriangle size={14} /> Out of Stock
                </span>
              ) : (
                <span className="badge badge-emerald">
                  <Check size={14} /> {product.stock} units available
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {product.description}
            </p>
          </div>

          {/* Purchase Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {/* Quantity Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    padding: '0.5rem 0.85rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 0.85rem', fontWeight: 700, fontSize: '0.95rem', minWidth: '35px', textAlign: 'center', color: 'var(--text-primary)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    padding: '0.5rem 0.85rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-secondary btn-lg"
                style={{ width: '100%' }}
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <Zap size={20} /> Buy Now
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem',
            padding: '1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Truck size={20} color="var(--accent-primary)" />
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Free Delivery</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders over ₹999</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ShieldCheck size={20} color="var(--accent-emerald)" />
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>2-Year Warranty</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            More in {product.category}
          </h2>
          <div className="product-grid">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
