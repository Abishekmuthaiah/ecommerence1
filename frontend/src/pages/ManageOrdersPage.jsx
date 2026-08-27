import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Search,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  Truck,
  Clock,
  Eye,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (search) params.search = search;

      const res = await orderService.getAllOrders(params);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, { status: newStatus });
      if (res.success) {
        showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Manage Customer Orders</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Inspect orders, check delivery addresses, and update fulfillment milestones.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.55rem 1rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>Customer & Destination</th>
                <th style={{ padding: '1rem' }}>Ordered Items</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Update Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No customer orders found matching filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {/* ID & Date */}
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>#{ord.id}</span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </td>

                    {/* Customer Info */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ord.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ord.customer_email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {ord.city}, {ord.state} ({ord.pincode})
                      </div>
                    </td>

                    {/* Items */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.825rem' }}>
                        {ord.items?.map((it) => (
                          <span key={it.id} style={{ color: 'var(--text-secondary)' }}>
                            {it.product_name} <strong style={{ color: 'var(--text-primary)' }}>×{it.quantity}</strong>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₹{parseFloat(ord.total_amount).toFixed(2)}</span>
                      <span className={ord.payment_status === 'Paid' ? 'badge badge-emerald' : 'badge badge-amber'} style={{ display: 'block', width: 'fit-content', marginTop: '0.35rem', fontSize: '0.65rem' }}>
                        {ord.payment_status}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '1rem' }}>
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="form-select"
                        style={{
                          width: 'auto',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.825rem',
                          background:
                            ord.order_status === 'Delivered' ? 'rgba(5, 150, 105, 0.15)' :
                            ord.order_status === 'Cancelled' ? 'rgba(220, 38, 38, 0.15)' :
                            'rgba(79, 70, 229, 0.15)',
                          color:
                            ord.order_status === 'Delivered' ? '#059669' :
                            ord.order_status === 'Cancelled' ? '#DC2626' :
                            '#4F46E5',
                          border: '1px solid currentColor',
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Link
                        to={`/my-orders/${ord.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.4rem 0.65rem' }}
                        title="View order details"
                      >
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
