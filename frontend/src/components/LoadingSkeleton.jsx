import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ width: '100%', height: '220px', borderRadius: '12px 12px 0 0' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton" style={{ width: '85%', height: '20px' }} />
        <div className="skeleton" style={{ width: '60%', height: '16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ width: '30%', height: '24px' }} />
          <div className="skeleton" style={{ width: '35%', height: '32px', borderRadius: '20px' }} />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
