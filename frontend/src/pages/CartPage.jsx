import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const shippingFee = cartSubtotal > 999 || cartSubtotal === 0 ? 0.00 : 99.00;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const totalAmount = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'NEXURA10' || code === 'APEX10') {
      setDiscountPercent(10);
      showToast('Promo code NEXURA10 applied! 10% discount added.', 'success');
    } else if (code === 'NEXURA20' || code === 'APEX20') {
      setDiscountPercent(20);
      showToast('Promo code NEXURA20 applied! 20% VIP discount added.', 'success');
    } else {
      showToast('Invalid promo code. Try NEXURA10 or NEXURA20', 'error');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '2.5rem 0' }}>
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="Explore our flagship electronics and precision gear to start building your setup."
          actionText="Explore Products"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Review Your Bag</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {cartItems.length} item{cartItems.length === 1 ? '' : 's'} ready for delivery
          </p>
        </div>
        <button
          onClick={clearCart}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <Trash2 size={15} /> Clear Bag
        </button>
      </div>

      {/* Cart Layout: Items List & Order Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }} className="cart-layout">
        {/* Left: Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => {
            const price = parseFloat(item.current_price || item.price);
            const itemTotal = price * item.quantity;

            return (
              <div
                key={item.id || item.product_id}
                className="card"
                style={{
                  padding: '1.2rem',
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto',
                  gap: '1.25rem',
                  alignItems: 'center',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {/* Product Thumbnail */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface-elevated)',
                }}>
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                    alt={item.product_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {item.category || 'Hardware'}
                  </span>
                  <Link
                    to={`/products/${item.product_id}`}
                    style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-primary)' }}
                  >
                    {item.product_name}
                  </Link>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ₹{price.toFixed(2)} each
                  </span>
                </div>

                {/* Quantity & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                    ₹{itemTotal.toFixed(2)}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {/* Quantity Controls */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.15rem 0.35rem',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id || item.product_id, item.quantity - 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          padding: '0.2rem 0.5rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 0.4rem', fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id || item.product_id, item.quantity + 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-primary)',
                          padding: '0.2rem 0.5rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeFromCart(item.id || item.product_id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.35rem',
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              marginTop: '0.5rem',
            }}
          >
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        {/* Right: Order Summary */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '90px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Bag Summary
          </h3>

          {/* Promo code form */}
          <form onSubmit={applyPromo} style={{ display: 'flex', gap: '0.4rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Code (NEXURA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.1rem', paddingRight: '0.5rem', textTransform: 'uppercase', fontSize: '0.825rem', borderRadius: 'var(--radius-full)' }}
              />
              <Tag size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
              Apply
            </button>
          </form>

          {/* Cost Line Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{cartSubtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)' }}>
                <span>Promo Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>FREE</span>
                ) : (
                  `₹${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '0.85rem',
              marginTop: '0.4rem',
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total Due</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                showToast('Please sign in or create an account to complete your order.', 'info');
                navigate('/login', { state: { from: { pathname: '/checkout' } } });
              } else {
                navigate('/checkout');
              }
            }}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.25rem' }}
          >
            Check Out <ArrowRight size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={15} color="var(--accent-emerald)" />
            <span>End-to-End Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
