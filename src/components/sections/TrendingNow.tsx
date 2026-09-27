import React from 'react';
import { useStore } from '../../context/StoreContext';
import { products } from '../../data/products';
import { Sparkles, ArrowLeft, Star } from 'lucide-react';

export const TrendingNow: React.FC = () => {
  const { navigateTo, openQuickView, formatPrice, products: storeProducts } = useStore();
  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;

  const trendingItems = activeProducts.filter((p) => p.trending).slice(0, 3);

  return (
    <section
      id="trending-now"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#071b13',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>إطلالات الموسم</span>
          </div>
          <h2 className="section-title">
            الأكثر رواجاً في <span className="text-gold-gradient">عالم الأزياء</span>
          </h2>
          <p className="section-subtitle">
            قطع استثنائية تصدرت اختيارات عميلاتنا الأنيقات ومناسباتهن الراقية هذا الشهر.
          </p>
        </div>

        {/* Featured Editorial Split Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center'
          }}
        >
          {/* Big Editorial Feature */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              minHeight: '480px',
              border: '1.5px solid var(--border-medium)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2.5rem'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="Haute Couture Runway Styling"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(7, 27, 19, 0.1) 0%, rgba(7, 27, 19, 0.7) 60%, rgba(7, 27, 19, 0.96) 100%)'
              }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="badge-gold" style={{ marginBottom: '0.75rem' }}>
                <Sparkles size={14} />
                <span>إطلالة الأسبوع الحصرية</span>
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                فن الأناقة الهادئة: خامات الحرير والكريب الملكي
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', maxWidth: '440px' }}>
                مزيج متناغم بين الفخامة والعملية، يمنحك حضوراً واثقاً في كافة اللقاءات والمناسبات الرسمية.
              </p>
              <button onClick={() => navigateTo('shop')} className="btn-primary">
                <span>اكتشفي الإطلالة الكاملة</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>

          {/* Trending Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {trendingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo('product', item.id)}
                style={{
                  background: 'rgba(17, 51, 36, 0.45)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                className="hover:border-gold-500 hover:shadow-gold"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{
                    width: '90px',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-400)', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                    <Star size={12} fill="var(--gold-400)" />
                    <span className="font-editorial">{item.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({item.reviews} تقييم)</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {item.name}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {item.fabric}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-editorial" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-300)' }}>
                      {formatPrice(item.price)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(item);
                      }}
                      className="btn-outline-gold"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      معاينة سريعة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
