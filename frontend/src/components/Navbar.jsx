import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  Package,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'var(--bg-surface-glass)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        {/* Brand Logo - Nexura */}
        <Link to="/" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'var(--text-primary)',
            color: 'var(--bg-surface)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition)',
          }}>
            <ShoppingBag size={19} color="currentColor" />
          </div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>
            Nexura<span style={{ color: 'var(--accent-primary)', marginLeft: '1px' }}>.</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop Apple-Style Pills */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'var(--bg-surface-elevated)',
          padding: '0.3rem 0.5rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
        }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/') ? 'var(--bg-surface)' : 'transparent',
              boxShadow: isActive('/') ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Store
          </Link>
          <Link
            to="/products"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/products') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/products') ? 'var(--bg-surface)' : 'transparent',
              boxShadow: isActive('/products') ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Products
          </Link>
          <Link
            to="/categories"
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              color: isActive('/categories') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive('/categories') ? 'var(--bg-surface)' : 'transparent',
              boxShadow: isActive('/categories') ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Categories
          </Link>
        </nav>

        {/* Search Bar - Center Capsule */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '360px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search products & innovations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem 0.55rem 2.4rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'var(--transition)',
            }}
          />
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </form>

        {/* Action Controls (Theme Toggle, Bag, User, Admin) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: isDark ? '#FF9F0A' : '#0071E3',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Bag Icon */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              transition: 'var(--transition)',
            }}
            title="Shopping Bag"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: 'var(--accent-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  minWidth: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  transition: 'var(--transition)',
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={user?.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.825rem', fontWeight: 600, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} color="var(--text-muted)" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    width: '220px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem 0',
                    zIndex: 1100,
                  }}
                >
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                    {isAdmin && (
                      <span className="badge badge-indigo" style={{ marginTop: '0.35rem', fontSize: '0.7rem' }}>
                        <ShieldCheck size={11} /> Admin
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMenus}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                      }}
                    >
                      <LayoutDashboard size={16} /> Admin Center
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    onClick={closeMenus}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <Package size={16} color="var(--text-secondary)" /> My Orders
                  </Link>

                  <Link
                    to="/profile"
                    onClick={closeMenus}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <UserIcon size={16} color="var(--text-secondary)" /> Profile
                  </Link>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.35rem' }}>
                    <button
                      onClick={() => {
                        closeMenus();
                        logout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--accent-rose)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'none',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}>
          <Link to="/" onClick={closeMenus} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Store</Link>
          <Link to="/products" onClick={closeMenus} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Products</Link>
          <Link to="/categories" onClick={closeMenus} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Categories</Link>
          {isAdmin && (
            <Link to="/admin" onClick={closeMenus} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Admin Center</Link>
          )}
        </div>
      )}
    </header>
  );
}
