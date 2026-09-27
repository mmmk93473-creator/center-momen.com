import React from 'react';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { SEOHead } from '../components/common/SEOHead';
import { Heart, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigateTo, products: storeProducts } = useStore();
  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;

  const savedProducts = activeProducts.filter((p) => wishlist.includes(p.id));

  return (
    <div style={{ backgroundColor: '#071b13', minHeight: '100vh', padding: '2rem 0 5rem 0' }}>
      <SEOHead title="قائمة الرغبات" description="راجعي القطع والتصاميم التي نالت إعجابكِ في مؤمن سنتر واقتنيها قبل نفاد الكمية." />

      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="section-tag">
            <span>مختاراتكِ الخاصة</span>
          </div>
          <h1 className="section-title">
            قائمة <span className="text-gold-gradient">الرغبات</span>
          </h1>
          <p className="section-subtitle">
            {savedProducts.length > 0
              ? `لديكِ ${savedProducts.length} قطعة محفوظة في قائمتكِ المفضلة.`
              : 'لم تقومي بحفظ أي قطع في قائمة الرغبات حتى الآن.'}
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div
            style={{
              background: 'rgba(17, 51, 36, 0.4)',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '5rem 2rem',
              textAlign: 'center',
              maxWidth: '550px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--gold-400)'
              }}
            >
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              قائمة الرغبات فارغة
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              انقري على رمز القلب على أي فستان أو قطعة في المتجر لحفظها هنا ومتابعتها لاحقاً.
            </p>
            <button onClick={() => navigateTo('shop')} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
              <span>استكشاف تشكيلات 2026</span>
              <ArrowLeft size={16} />
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
