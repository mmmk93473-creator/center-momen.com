import React from 'react';
import { categories } from '../../data/categories';
import { CategoryCard } from '../shop/CategoryCard';

export const ShopByCategory: React.FC = () => {
  return (
    <section
      id="shop-by-category"
      style={{
        padding: 'var(--space-4xl) 0',
        position: 'relative',
        backgroundColor: '#071b13'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <span>تشكيلات حصرية</span>
          </div>
          <h2 className="section-title">
            تسوّقي حسب <span className="text-gold-gradient">التصنيف</span>
          </h2>
          <p className="section-subtitle">
            استكشفي مجموعاتنا المنتقاة بعناية فائقة لتلائم جميع مناسباتكِ اليومية والمسائية الراقية.
          </p>
        </div>

        {/* Categories Grid (Responsive) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};
