import React from 'react';
import type { CategoryId } from '../../types/product';
import { categories } from '../../data/categories';
import { X, RotateCcw, Filter, Check } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (cat: CategoryId | 'all') => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  totalResults: number;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedSizes,
  onToggleSize,
  sortBy,
  onSortChange,
  onClearFilters,
  totalResults,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Drawer Header (mobile only) */}
      {isMobileDrawer && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--gold-400)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              تصفية النتائج ({totalResults})
            </h3>
          </div>
          <button onClick={onCloseMobileDrawer} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Sorting */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.6rem' }}>
          ترتيب حسب:
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(7, 27, 19, 0.8)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 0.8rem',
            fontSize: '0.88rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="featured">الأكثر تميزاً وشهرة</option>
          <option value="newest">وصل حديثاً</option>
          <option value="price-asc">السعر: من الأقل للأعلى</option>
          <option value="price-desc">السعر: من الأعلى للأقل</option>
          <option value="rating">الأعلى تقييماً</option>
        </select>
      </div>

      {/* Categories Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.75rem' }}>
          الأقسام والتشكيلات:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            onClick={() => onSelectCategory('all')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              background: selectedCategory === 'all' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              border: selectedCategory === 'all' ? '1px solid var(--gold-500)' : '1px solid transparent',
              color: selectedCategory === 'all' ? 'var(--gold-300)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: selectedCategory === 'all' ? 700 : 500,
              textAlign: 'right'
            }}
          >
            <span>جميع المنتجات</span>
            {selectedCategory === 'all' && <Check size={14} color="var(--gold-400)" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: selectedCategory === cat.id ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                border: selectedCategory === cat.id ? '1px solid var(--gold-500)' : '1px solid transparent',
                color: selectedCategory === cat.id ? 'var(--gold-300)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                textAlign: 'right'
              }}
            >
              <span>{cat.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-300)' }}>
            نطاق السعر:
          </label>
          <span className="font-editorial" style={{ fontSize: '0.85rem', color: 'var(--gold-400)' }}>
            حتى {priceRange[1]} ج.م
          </span>
        </div>
        <input
          type="range"
          min="800"
          max="5500"
          step="100"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
          style={{
            width: '100%',
            accentColor: 'var(--gold-500)',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
          <span>800 ج.م</span>
          <span>5,500 ج.م</span>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-300)', marginBottom: '0.6rem' }}>
          المقاسات المتاحة:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {ALL_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onToggleSize(size)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--gold-500)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#071b13' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.65rem',
          background: 'transparent',
          border: '1px dashed var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)',
          fontSize: '0.82rem',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}
        className="hover:border-gold-500 hover:text-gold-300"
      >
        <RotateCcw size={14} />
        <span>إعادة ضبط كافة الفلاتر</span>
      </button>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 3500,
          background: 'rgba(5, 20, 14, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
        onClick={onCloseMobileDrawer}
      >
        <div
          style={{
            width: '85%',
            maxWidth: '380px',
            height: '100%',
            background: 'rgba(7, 27, 19, 0.98)',
            padding: '1.5rem',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside
      style={{
        background: 'rgba(17, 51, 36, 0.35)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        position: 'sticky',
        top: '100px'
      }}
    >
      {content}
    </aside>
  );
};
