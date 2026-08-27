import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Shield,
  TrendingUp,
  Headphones,
  Laptop,
  Watch,
  Gamepad2,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { GridSkeleton } from '../components/LoadingSkeleton';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          productService.getCategories(),
        ]);
        if (prodData.success) {
          setFeaturedProducts(prodData.products || []);
        }
        if (catData.success) {
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'audio': return Headphones;
      case 'electronics': return Laptop;
      case 'wearables': return Watch;
      case 'gaming': return Gamepad2;
      default: return Cpu;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* Apple-Inspired Keynote Hero Banner */}
      <section style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--bg-hero-gradient)',
        border: '1px solid var(--hero-border)',
        boxShadow: 'var(--shadow-md)',
        padding: '4.5rem 2.5rem',
        marginTop: '0.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Soft Ambient Light Glow */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 113, 227, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '740px',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}>
          <div style={{ display: 'inline-flex' }}>
            <span className="badge badge-indigo" style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}>
              <Sparkles size={13} /> Nexura Hardware Release
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
          }}>
            Pro power. <br />
            <span className="gradient-text">Pure elegance.</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '560px',
          }}>
            Explore precision studio audio, ultra-fast gaming peripherals, high-performance computing, and biometric wearables crafted for perfection.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Collection <ArrowRight size={17} />
            </Link>
            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
              <Zap size={16} color="var(--accent-amber)" /> Featured Deals
            </Link>
          </div>

          {/* Keynote Highlights Chip Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            marginTop: '1.5rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="var(--accent-emerald)" /> Free Global Delivery
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="var(--accent-emerald)" /> 2-Year Full Warranty
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={15} color="var(--accent-emerald)" /> 30-Day Risk-Free Returns
            </span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.4rem', fontSize: '0.725rem' }}>Curated Gear</span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>Browse by Category</h2>
          </div>
          <Link to="/categories" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 113, 227, 0.08)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Explore line →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: '0.4rem', fontSize: '0.725rem' }}>
              <Flame size={13} color="var(--accent-rose)" /> Popular Picks
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>Featured Innovations</h2>
          </div>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem' }}>
            Browse Catalog <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Keynote Banner */}
      <section style={{
        background: 'var(--text-primary)',
        color: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ maxWidth: '580px' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.75rem', fontSize: '0.725rem' }}>
            Exclusive Launch Offer
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--bg-surface)', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>
            Experience Nexura Precision
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.6 }}>
            Use promo code <strong style={{ color: 'var(--bg-surface)' }}>NEXURA10</strong> at checkout for an instant 10% discount on flagship headsets, displays, and ultrabooks.
          </p>
        </div>
        <Link to="/products?category=Gaming" className="btn btn-primary btn-lg" style={{ background: 'var(--accent-primary)', color: '#FFFFFF', fontWeight: 600 }}>
          Shop Collection <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
