import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { products } from '../../data/products';
import { Search, X, ArrowLeft, Sparkles } from 'lucide-react';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo, openQuickView, formatPrice, products: storeProducts } = useStore();
  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter products by query
  const cleanQuery = searchTerm.trim().toLowerCase();
  const results = cleanQuery
    ? activeProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.nameEn.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery)
      )
    : [];

  const popularSearches = ['فستان الزمرد', 'حرير طبيعي', 'بليزر كوتور', 'حقيبة يد', 'قفطان', 'بناطيل بالازو'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: 'rgba(5, 20, 14, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div className="container" style={{ padding: '2rem 1.5rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-400)' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>البحث السريع في مجموعة مؤمن سنتر</span>
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'var(--gold-300)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="إغلاق البحث"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Bar */}
        <div
          style={{
            position: 'relative',
            background: 'rgba(17, 51, 36, 0.7)',
            border: '1.5px solid var(--gold-500)',
            borderRadius: 'var(--radius-full)',
            padding: '0.8rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(212, 175, 55, 0.25)'
          }}
        >
          <Search size={24} color="var(--gold-400)" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحثي عن فستان، بلوزة، خامة حرير، أو قطعة محددة..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '1.15rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Popular Tags */}
        {!searchTerm && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              عمليات البحث الشائعة:
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.45rem 1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover:border-gold-500 hover:text-gold-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div style={{ marginTop: '2rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {searchTerm && results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                لم يتم العثور على نتائج تطابق "{searchTerm}"
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                جربي البحث بكلمات أخرى مثل "فساتين"، "حرير"، أو "بليزر".
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {results.map((product) => (
                <div
                  key={product.id}
                  style={{
                    background: 'rgba(17, 51, 36, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover:border-gold-500"
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigateTo('product', product.id);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: '60px',
                        height: '75px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {product.name}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                        {product.fabric}
                      </p>
                      <span className="font-editorial" style={{ color: 'var(--gold-400)', fontWeight: 700 }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchOpen(false);
                        openQuickView(product);
                      }}
                      className="btn-outline-gold"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      معاينة سريعة
                    </button>
                    <ArrowLeft size={16} color="var(--gold-400)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
