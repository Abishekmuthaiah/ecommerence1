import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Clock, ChevronRight, AlertCircle, ShoppingBag, XCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import EmptyState from '../components/EmptyState';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      if (user?.id) {
        try {
          setLoading(true);
          const res = await orderService.getUserOrders(user.id);
          if (res.success) {
            setOrders(res.orders || []);
          }
        } catch (err) {
          console.error('Error loading orders:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return;
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(cancelOrderId);
      if (res.success) {
        setOrders(orders.map((o) => (o.id === cancelOrderId ? res.order : o)));
        setToastMessage(`Order #${cancelOrderId} cancelled and refunded successfully.`);
        setCancelOrderId(null);
        setTimeout(() => setToastMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-emerald">Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-cyan">Shipped</span>;
      case 'Processing':
      case 'Confirmed':
        return <span className="badge badge-indigo">{status}</span>;
      case 'Cancelled':
        return <span className="badge badge-rose">Cancelled</span>;
      default:
        return <span className="badge badge-amber">{status || 'Pending'}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track, manage, and view invoices for all your orders.
        </p>
      </div>

      {toastMessage && (
        <div style={{
          background: 'rgba(225, 29, 72, 0.1)',
          border: '1px solid rgba(225, 29, 72, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          color: 'var(--accent-rose)',
          fontSize: '0.95rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}>
          <CheckCircle2 size={20} />
          {toastMessage}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="You haven't placed any orders yet. Check out our tech collection and grab your first item!"
          actionText="Start Shopping"
          actionLink="/products"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const isCancellable = order.order_status !== 'Cancelled' && order.order_status !== 'Delivered';

            return (
              <div
                key={order.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Order Top Meta */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.65rem', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '10px', color: 'var(--accent-primary)' }}>
                      <Package size={22} />
                    </div>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Order #{order.id}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={14} /> Placed on {formattedDate}
                        </span>
                        <span>•</span>
                        <span>{order.payment_method}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getStatusBadge(order.order_status)}
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails & CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto' }}>
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.4rem 0.65rem',
                          background: 'var(--bg-surface-elevated)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.825rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <img
                          src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                          alt={item.product_name}
                          style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {item.product_name}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {isCancellable && (
                      <button
                        onClick={() => setCancelOrderId(order.id)}
                        className="btn btn-danger btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <XCircle size={15} /> Cancel Order
                      </button>
                    )}
                    <Link
                      to={`/my-orders/${order.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelOrderId && (
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

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>Cancel Order #{cancelOrderId}?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Are you sure you want to cancel this order? All items will be restored to live stock and your payment will be refunded.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setCancelOrderId(null)}
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
