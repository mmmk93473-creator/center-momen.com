import React, { useState } from 'react';
import type { Category } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { navigateTo, setSelectedCategoryFilter } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setSelectedCategoryFilter(category.id);
    navigateTo('shop', undefined, category.id);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        height: '420px',
        cursor: 'pointer',
        border: '1px solid var(--border-subtle)',
        boxShadow: isHovered
          ? '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.25)'
          : '0 8px 24px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)'
      }}
      className="category-card"
    >
      {/* Background Image with Zoom */}
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          filter: isHovered ? 'brightness(0.95)' : 'brightness(0.85)'
        }}
      />

      {/* Luxury Gradient Tint Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 27, 19, 0.1) 0%, rgba(7, 27, 19, 0.5) 50%, rgba(7, 27, 19, 0.95) 100%)',
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* Top Count Badge */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'rgba(7, 27, 19, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-full)',
          padding: '0.35rem 0.85rem',
          fontSize: '0.8rem',
          color: 'var(--gold-300)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}
      >
        <Sparkles size={12} color="var(--gold-400)" />
        <span>{category.count} قطعة مصممة</span>
      </div>

      {/* Bottom Content & Revealed Text */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2
        }}
      >
        <span
          className="font-editorial"
          style={{
            fontSize: '0.85rem',
            color: 'var(--gold-400)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.35rem',
            fontWeight: 600
          }}
        >
          {category.nameEn}
        </span>

        <h3
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '0.5rem',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
          }}
        >
          {category.name}
        </h3>

        {/* Revealed Description on Hover */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            maxHeight: isHovered ? '80px' : '0px',
            opacity: isHovered ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {category.description}
        </p>

        {/* Action Button */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: 'var(--gold-300)',
            fontSize: '0.9rem',
            fontWeight: 700
          }}
        >
          <span>تصفحي التشكيلة</span>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isHovered ? 'var(--gold-500)' : 'rgba(212, 175, 55, 0.15)',
              color: isHovered ? '#071b13' : 'var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateX(-4px)' : 'translateX(0)'
            }}
          >
            <ArrowLeft size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};
