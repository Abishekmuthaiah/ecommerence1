import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Clock, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 'auto',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      {/* Value Proposition Highlights */}
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.5rem',
        background: 'var(--bg-surface-elevated)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(0, 113, 227, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-primary)' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Free Express Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>On all orders exceeding ₹999</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(52, 199, 89, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>2-Year Official Warranty</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>100% genuine verified hardware</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(2, 132, 199, 0.08)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-cyan)' }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>30-Day Easy Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant hassle-free refund process</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255, 149, 0, 0.1)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-amber)' }}>
              <Clock size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>24/7 Dedicated Support</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Real-time expert technical help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '3rem',
      }}>
        {/* Company Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{
              background: 'var(--text-primary)',
              color: 'var(--bg-surface)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={17} color="currentColor" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              Nexura<span style={{ color: 'var(--accent-primary)' }}>.</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Next-generation flagship electronics & computing designed for creators, developers, and enthusiasts.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} color="var(--text-muted)" /> 100 Infinite Loop, Cupertino, CA
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="var(--text-muted)" /> +1 (800) 555-0199
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--text-muted)" /> support@nexura.com
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>Explore Catalog</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/products" style={{ transition: 'var(--transition)' }}>All Innovations</Link></li>
            <li><Link to="/categories" style={{ transition: 'var(--transition)' }}>Browse Categories</Link></li>
            <li><Link to="/products?featured=true" style={{ transition: 'var(--transition)' }}>Featured Hardware</Link></li>
            <li><Link to="/products?sort=price_asc" style={{ transition: 'var(--transition)' }}>Special Deals</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.2rem', color: 'var(--text-primary)' }}>Customer Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li><Link to="/my-orders" style={{ transition: 'var(--transition)' }}>Track Order Status</Link></li>
            <li><Link to="/cart" style={{ transition: 'var(--transition)' }}>Shopping Bag</Link></li>
            <li><Link to="/profile" style={{ transition: 'var(--transition)' }}>Account Profile</Link></li>
            <li><Link to="/login" style={{ transition: 'var(--transition)' }}>Customer Sign In</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
      }}>
        © {new Date().getFullYear()} Nexura Inc. All rights reserved.
      </div>
    </footer>
  );
}
