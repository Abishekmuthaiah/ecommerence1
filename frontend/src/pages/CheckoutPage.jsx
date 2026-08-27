import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '+1 555-0144',
    shipping_address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'Oregon',
    pincode: '97477',
    payment_method: 'Demo Online Payment',
  });

  const [loading, setLoading] = useState(false);

  const shippingFee = cartSubtotal > 999 || cartSubtotal === 0 ? 0.00 : 99.00;
  const totalAmount = cartSubtotal + shippingFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/cart');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        user_id: user?.id || 2,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        payment_method: formData.payment_method,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.current_price || item.price,
          quantity: item.quantity,
        })),
      };

      const res = await orderService.createOrder(payload);

      if (res.success && res.order) {
        await clearCart();
        showToast('Order placed successfully!', 'success');
        navigate(`/order-success/${res.order.id}`, { state: { order: res.order } });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const msg = error.response?.data?.message || 'Failed to place order';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div>
        <Link
          to="/cart"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Secure Checkout</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Please confirm your delivery address and choose your simulated payment method.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'start' }} className="checkout-layout">
        {/* Left Column: Customer & Delivery Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Section 1: Customer Contact */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              Customer Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email for Order Updates</label>
              <input
                type="email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              Shipping Address
            </h3>

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="shipping_address"
                required
                placeholder="Apartment, suite, unit, street"
                value={formData.shipping_address}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Pincode / ZIP</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              Payment Selection
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Demo Online Payment Option */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.payment_method === 'Demo Online Payment' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  background: formData.payment_method === 'Demo Online Payment' ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="Demo Online Payment"
                  checked={formData.payment_method === 'Demo Online Payment'}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                <div style={{ padding: '0.5rem', background: 'rgba(79, 70, 229, 0.15)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                  <CreditCard size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Simulated Instant Payment (Demo Gateway)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant verification & instant order confirmation</div>
                </div>
              </label>

              {/* Cash on Delivery Option */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.payment_method === 'Cash on Delivery' ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  background: formData.payment_method === 'Cash on Delivery' ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-surface-elevated)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="Cash on Delivery"
                  checked={formData.payment_method === 'Cash on Delivery'}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                <div style={{ padding: '0.5rem', background: 'rgba(5, 150, 105, 0.15)', borderRadius: '8px', color: 'var(--accent-emerald)' }}>
                  <Banknote size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay cash upon product arrival at your door</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            Review Items ({cartItems.length})
          </h3>

          {/* Items Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.id || item.product_id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                  alt={item.product_name}
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.product_name}
                  </p>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                    Qty: {item.quantity} × ₹{(item.current_price || item.price)}
                  </p>
                </div>
                <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{((item.current_price || item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{cartSubtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping Delivery</span>
              <span style={{ color: shippingFee === 0 ? 'var(--accent-emerald)' : 'var(--text-primary)', fontWeight: 600 }}>
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '1px solid var(--border-medium)',
              paddingTop: '0.85rem',
              marginTop: '0.35rem',
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Total to Pay</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            {loading ? 'Processing Order...' : 'Place Order & Pay'} <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Lock size={14} color="var(--accent-emerald)" />
            <span>Microservice-verified stock & transactions</span>
          </div>
        </div>
      </form>
    </div>
  );
}
