import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [orderStatsRes, userStatsRes] = await Promise.all([
          orderService.getOrderStats(),
          authService.getStats(),
        ]);

        if (orderStatsRes.success) {
          setRecentOrders(orderStatsRes.recentOrders || []);
        }

        setStats({
          totalRevenue: orderStatsRes.stats?.totalRevenue || 0,
          totalOrders: orderStatsRes.stats?.totalOrders || 0,
          pendingOrders: orderStatsRes.stats?.pendingOrders || 0,
          totalProducts: userStatsRes.stats?.totalProducts || 0,
          totalUsers: userStatsRes.stats?.totalUsers || 0,
        });
      } catch (err) {
        console.error('Error loading admin statistics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'var(--accent-emerald)', bg: 'rgba(52, 199, 89, 0.1)' },
    { title: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'var(--accent-primary)', bg: 'rgba(0, 113, 227, 0.1)' },
    { title: 'Pending Fulfillment', value: stats.pendingOrders, icon: Clock, color: 'var(--accent-amber)', bg: 'rgba(255, 149, 0, 0.1)' },
    { title: 'Catalog Items', value: stats.totalProducts, icon: ShoppingBag, color: 'var(--accent-cyan)', bg: 'rgba(2, 132, 199, 0.1)' },
    { title: 'Customers', value: stats.totalUsers, icon: Users, color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-indigo" style={{ fontSize: '0.725rem' }}>
              <ShieldCheck size={13} /> Nexura Admin Console
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
            Executive Overview
          </h1>
        </div>

        {/* Quick Admin Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            <ShoppingBag size={15} /> Catalog
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <Package size={15} /> Orders
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            <Users size={15} /> Customers
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                padding: '1.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                }}
              >
                <Icon size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {card.title}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem', letterSpacing: '-0.02em' }}>
                  {card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Overview */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.015em' }}>
            Recent Customer Orders
          </h3>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
            All Orders <ArrowRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0', fontSize: '0.9rem' }}>No recent orders.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-xs) 0 0 var(--radius-xs)' }}>Order ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Items</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', borderRadius: '0 var(--radius-xs) var(--radius-xs) 0' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>#{ord.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customer_email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {ord.items?.length || 1} item{ord.items?.length === 1 ? '' : 's'}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{parseFloat(ord.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={
                        ord.order_status === 'Delivered' ? 'badge badge-emerald' :
                        ord.order_status === 'Cancelled' ? 'badge badge-rose' :
                        'badge badge-indigo'
                      } style={{ fontSize: '0.7rem' }}>
                        {ord.order_status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
