import React from 'react';
import { products } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, HeartHandshake } from 'lucide-react';

export const BestSellers: React.FC = () => {
  const { navigateTo, products: storeProducts } = useStore();
  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;

  const bestSellers = activeProducts.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <section
      id="best-sellers"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#071b13',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>اختيارات العميلات</span>
          </div>
          <h2 className="section-title">
            الأكثر طلباً و<span className="text-gold-gradient">مبيعاً</span>
          </h2>
          <p className="section-subtitle">
            القطع التي حازت على أعلى تقييمات وإعجاب عميلاتنا في جميع محافظات مصر.
          </p>
        </div>

        {/* 4 Columns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Trust Highlight Banner */}
        <div
          style={{
            marginTop: '3.5rem',
            background: 'rgba(17, 51, 36, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-400)',
                flexShrink: 0
              }}
            >
              <HeartHandshake size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                أكثر من 25,000 عميلة راضية منذ عام 1999
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                تقييمات حقيقية وتجارب موثوقة مع خاماتنا الفاخرة وخدمات التوصيل السريع.
              </p>
            </div>
          </div>

          <button onClick={() => navigateTo('shop')} className="btn-secondary">
            <span>تصفحي كافة الأكثر مبيعاً</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
