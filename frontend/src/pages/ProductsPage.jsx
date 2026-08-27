import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { GridSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters from URL
  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentFeatured = searchParams.get('featured') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await productService.getCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    async function fetchFilteredProducts() {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };

        if (currentSearch) params.search = currentSearch;
        if (currentCategory && currentCategory !== 'All') params.category = currentCategory;
        if (currentMinPrice) params.minPrice = currentMinPrice;
        if (currentMaxPrice) params.maxPrice = currentMaxPrice;
        if (currentFeatured) params.featured = currentFeatured;

        const data = await productService.getProducts(params);
        if (data.success) {
          setProducts(data.products || []);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice, currentFeatured, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory !== 'All' || currentSearch || currentMinPrice || currentMaxPrice || currentFeatured;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Products</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Showing {totalCount} result{totalCount === 1 ? '' : 's'} {currentCategory !== 'All' ? `in ${currentCategory}` : ''}
            {currentSearch ? ` matching "${currentSearch}"` : ''}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpDown size={15} /> Sort by:
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.55rem 1rem', fontSize: '0.875rem' }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Customer Rated</option>
            <option value="name_asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Sidebar & Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="products-layout">
        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} color="var(--accent-primary)" /> Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                Categories
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <button
                  onClick={() => updateParam('category', 'All')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: currentCategory === 'All' ? 700 : 500,
                    background: currentCategory === 'All' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: currentCategory === 'All' ? '#818CF8' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  All Categories
                  {currentCategory === 'All' && <Check size={16} />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.name)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: currentCategory === cat.name ? 700 : 500,
                      background: currentCategory === cat.name ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: currentCategory === cat.name ? '#818CF8' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {cat.name}
                    {currentCategory === cat.name && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                Price Range (₹)
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={currentMinPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="form-input"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={currentMaxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="form-input"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Quick Toggles */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                Special
              </h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={currentFeatured === 'true'}
                  onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                Featured Products Only
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div>
          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Active filters:</span>
              {currentCategory !== 'All' && (
                <span className="badge badge-indigo" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Category: {currentCategory}
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => updateParam('category', 'All')} />
                </span>
              )}
              {currentSearch && (
                <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Search: "{currentSearch}"
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => updateParam('search', '')} />
                </span>
              )}
              {currentMinPrice && (
                <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Min: ₹{currentMinPrice}
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => updateParam('minPrice', '')} />
                </span>
              )}
              {currentMaxPrice && (
                <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Max: ₹{currentMaxPrice}
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => updateParam('maxPrice', '')} />
                </span>
              )}
            </div>
          )}

          {loading ? (
            <GridSkeleton count={9} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products matched your criteria"
              description="Try changing category, resetting your price filters or searching with different keywords."
              actionText="Clear All Filters"
              actionLink="/products"
            />
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                  <button
                    onClick={() => updateParam('page', currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => updateParam('page', pg)}
                      className={`btn btn-sm ${currentPage === pg ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ minWidth: '36px' }}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    onClick={() => updateParam('page', currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="btn btn-secondary btn-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
