import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleQuickDemo = async (role) => {
    if (role === 'admin') {
      setEmail('admin@ecommerce.com');
      setPassword('Admin@123');
      setLoading(true);
      const res = await login('admin@ecommerce.com', 'Admin@123');
      setLoading(false);
      if (res.success) navigate('/admin');
    } else {
      setEmail('customer@ecommerce.com');
      setPassword('Customer@123');
      setLoading(true);
      const res = await login('customer@ecommerce.com', 'Customer@123');
      setLoading(false);
      if (res.success) navigate(from, { replace: true });
    }
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '2.5rem auto',
      width: '100%',
    }}>
      <div className="card" style={{ padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--text-primary)',
            color: 'var(--bg-surface)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <LogIn size={22} color="currentColor" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Welcome to Nexura</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Sign in to access your orders, saved bag, and preferences.
          </p>
        </div>

        {/* Quick Demo Fillers */}
        <div style={{
          padding: '0.9rem',
          background: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Instant Demo Access
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', borderRadius: 'var(--radius-full)' }}
            >
              <ShieldCheck size={14} color="var(--accent-primary)" /> Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', borderRadius: 'var(--radius-full)' }}
            >
              <UserCheck size={14} color="var(--accent-emerald)" /> Demo Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
