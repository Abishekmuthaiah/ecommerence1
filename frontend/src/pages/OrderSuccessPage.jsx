import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, Home } from 'lucide-react';
import { orderService } from '../services/orderService';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && id) {
      async function fetchOrder() {
        try {
          const res = await orderService.getOrderById(id);
          if (res.success) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error('Error loading order:', err);
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
  }, [id, order]);

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Success Badge Banner */}
      <div className="card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(5, 150, 105, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669',
          boxShadow: '0 0 30px rgba(5, 150, 105, 0.2)',
        }}>
          <CheckCircle size={42} />
        </div>

        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Payment Confirmed</span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Thank You For Your Order!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.35rem' }}>
            We've received your order and our fulfillment team is preparing it for shipment.
          </p>
        </div>

        {/* Order Meta Box */}
        <div style={{
          width: '100%',
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          textAlign: 'left',
          fontSize: '0.9rem',
          marginTop: '0.5rem',
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Order Reference</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
              #{id || order?.id}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Estimated Delivery</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Total Paid</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{order?.total_amount ? parseFloat(order.total_amount).toFixed(2) : '999.00'}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Payment Method</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {order?.payment_method || 'Demo Online Payment'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
          <Link to={`/my-orders/${id || order?.id}`} className="btn btn-primary" style={{ flex: 1, minWidth: '200px' }}>
            <Package size={18} /> View Order Status
          </Link>
          <Link to="/products" className="btn btn-secondary" style={{ flex: 1, minWidth: '200px' }}>
            <Home size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
