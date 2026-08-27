import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, Laptop, Watch, Gamepad2, Cpu, Grid } from 'lucide-react';
import { productService } from '../services/productService';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await productService.getCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <div>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Browse</span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Product Categories</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Discover our curated collection of tech devices, gaming gear, and performance electronics.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '260px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.slug);
            return (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                }}
              >
                {/* Background Image with Gradient Overlay */}
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600'}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'brightness(0.55)',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.3) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Card Content */}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.25)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818CF8',
                    marginBottom: '0.25rem',
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                    {cat.description}
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#818CF8',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginTop: '0.5rem',
                  }}>
                    Shop Collection <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
