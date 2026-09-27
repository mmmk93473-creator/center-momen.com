import React, { useState } from 'react';
import { products } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft } from 'lucide-react';

export const NewArrivals: React.FC = () => {
  const { navigateTo, products: storeProducts } = useStore();
  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;
  const [activeTab, setActiveTab] = useState<'all' | 'dresses' | 'blouses' | 'jackets'>('all');

  const newItems = activeProducts.filter((p) => p.newArrival || p.featured);
  const displayedItems = activeTab === 'all'
    ? newItems.slice(0, 8)
    : newItems.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section
      id="new-arrivals"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#0c261b',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header with Navigation Link */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}
        >
          <div className="section-tag">
            <span>أحدث الإبداعات</span>
          </div>
          <h2 className="section-title">
            وصل حديثاً إلى <span className="text-gold-gradient">مؤمن سنتر</span>
          </h2>
          <p className="section-subtitle">
            تصاميم حديثة تنبض بالأنوثة والرقي تم ابتكارها خصيصاً لموسم 2026.
          </p>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              marginTop: '1.5rem',
              background: 'rgba(7, 27, 19, 0.7)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? 'var(--gradient-gold)' : 'transparent',
                color: activeTab === 'all' ? '#071b13' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: activeTab === 'all' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveTab('dresses')}
              style={{
                background: activeTab === 'dresses' ? 'var(--gradient-gold)' : 'transparent',
                color: activeTab === 'dresses' ? '#071b13' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: activeTab === 'dresses' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              فساتين
            </button>
            <button
              onClick={() => setActiveTab('blouses')}
              style={{
                background: activeTab === 'blouses' ? 'var(--gradient-gold)' : 'transparent',
                color: activeTab === 'blouses' ? '#071b13' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: activeTab === 'blouses' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              بلوزات
            </button>
            <button
              onClick={() => setActiveTab('jackets')}
              style={{
                background: activeTab === 'jackets' ? 'var(--gradient-gold)' : 'transparent',
                color: activeTab === 'jackets' ? '#071b13' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.45rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: activeTab === 'jackets' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              جاكيتات
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {displayedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Explore All CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button
            onClick={() => navigateTo('shop')}
            className="btn-secondary"
            style={{ padding: '0.85rem 2.25rem' }}
          >
            <span>استكشاف كافة المنتجات الجديدة</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
