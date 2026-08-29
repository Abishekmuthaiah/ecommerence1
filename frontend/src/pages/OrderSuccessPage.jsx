import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, Home, XCircle, AlertTriangle } from 'lucide-react';
import { orderService } from '../services/orderService';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);

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

  const handleCancelOrder = async () => {
    const orderId = id || order?.id;
    if (!orderId) return;

    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        setOrder(res.order);
        setCancelMessage('Your order has been cancelled and refunded successfully.');
        setShowCancelModal(false);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const isCancelled = order?.order_status === 'Cancelled';

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Success / Cancelled Badge Banner */}
      <div className="card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: isCancelled ? 'rgba(225, 29, 72, 0.15)' : 'rgba(5, 150, 105, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isCancelled ? '#E11D48' : '#059669',
          boxShadow: isCancelled ? '0 0 30px rgba(225, 29, 72, 0.2)' : '0 0 30px rgba(5, 150, 105, 0.2)',
        }}>
          {isCancelled ? <XCircle size={42} /> : <CheckCircle size={42} />}
        </div>

        <div>
          <span className={isCancelled ? "badge badge-rose" : "badge badge-emerald"} style={{ marginBottom: '0.5rem' }}>
            {isCancelled ? 'Order Cancelled' : 'Payment Confirmed'}
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {isCancelled ? 'Order Has Been Cancelled' : 'Thank You For Your Order!'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.35rem' }}>
            {isCancelled
              ? 'Your order was successfully cancelled. Any paid amount has been initiated for refund.'
              : "We've received your order and our fulfillment team is preparing it for shipment."}
          </p>
        </div>

        {cancelMessage && (
          <div style={{
            width: '100%',
            background: 'rgba(225, 29, 72, 0.1)',
            border: '1px solid rgba(225, 29, 72, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            color: 'var(--accent-rose)',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {cancelMessage}
          </div>
        )}

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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Order Status</span>
            <span style={{ fontWeight: 700, color: isCancelled ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
              {order?.order_status || 'Confirmed'}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Total Amount</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{order?.total_amount ? parseFloat(order.total_amount).toFixed(2) : '999.00'}
            </span>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Payment Status</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {order?.payment_status || 'Paid'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
          <Link to={`/my-orders/${id || order?.id}`} className="btn btn-primary" style={{ flex: 1, minWidth: '180px' }}>
            <Package size={18} /> View Order Details
          </Link>

          {!isCancelled && order?.order_status !== 'Delivered' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn btn-danger"
              style={{ flex: 1, minWidth: '180px' }}
            >
              <XCircle size={18} /> Cancel Order
            </button>
          )}

          <Link to="/products" className="btn btn-secondary" style={{ flex: 1, minWidth: '180px' }}>
            <Home size={18} /> Continue Shopping
          </Link>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(225, 29, 72, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <AlertTriangle size={32} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>Cancel Order #{id || order?.id}?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Are you sure you want to cancel this order? The reserved inventory will be restocked and any payments will be refunded.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={cancelling}
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="btn btn-danger"
                style={{ flex: 1 }}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
