import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Star, Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export const ProductQuickView: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    formatPrice
  } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIndex(0);
      setSelectedSize(quickViewProduct.sizes[0] || 'M');
      setSelectedColor(quickViewProduct.colors[0]?.name || '');
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    closeQuickView();
  };

  const handleFullDetails = () => {
    closeQuickView();
    navigateTo('product', quickViewProduct.id);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4000,
        background: 'rgba(5, 20, 14, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={closeQuickView}
    >
      <div
        style={{
          background: 'rgba(11, 35, 25, 0.98)',
          border: '1.5px solid var(--gold-500)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.2)',
          position: 'relative',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: 'var(--gold-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
          aria-label="إغلاق المعاينة"
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Gallery Column */}
          <div>
            <div
              style={{
                width: '100%',
                paddingTop: '120%',
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: '#071b13',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <img
                src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnails */}
            {quickViewProduct.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto' }}>
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '75px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`صورة مصغرة ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Category & Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge-gold">
                  {quickViewProduct.fabric}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-400)' }}>
                  <Star size={14} fill="var(--gold-400)" />
                  <span className="font-editorial" style={{ fontWeight: 700 }}>{quickViewProduct.rating}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({quickViewProduct.reviews} تقييم)</span>
                </div>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {quickViewProduct.name}
              </h2>

              {/* Pricing */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span className="font-editorial" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold-300)' }}>
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.oldPrice && (
                  <span className="font-editorial" style={{ fontSize: '1.1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    {formatPrice(quickViewProduct.oldPrice)}
                  </span>
                )}
                {quickViewProduct.discount && (
                  <span style={{ background: 'var(--gold-500)', color: '#071b13', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-xs)' }}>
                    وفرتي {quickViewProduct.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {quickViewProduct.description}
              </p>

              {/* Color Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  اللون المختار: <strong style={{ color: 'var(--gold-300)' }}>{selectedColor}</strong>
                </label>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {quickViewProduct.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        background: selectedColor === color.name ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: selectedColor === color.name ? '1.5px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                        color: selectedColor === color.name ? 'var(--gold-200)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color.hex, display: 'inline-block' }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    المقاس: <strong style={{ color: 'var(--gold-300)' }}>{selectedSize}</strong>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-400)', cursor: 'pointer' }}>دليل المقاسات</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: selectedSize === size ? 'var(--gold-500)' : 'rgba(255, 255, 255, 0.05)',
                        border: selectedSize === size ? 'none' : '1px solid var(--border-subtle)',
                        color: selectedSize === size ? '#071b13' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.9rem', fontSize: '0.95rem' }}
                >
                  <ShoppingBag size={18} />
                  <span>إضافة إلى حقيبة التسوق</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  style={{
                    width: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: inWishlist ? 'var(--gold-500)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-medium)',
                    color: inWishlist ? '#071b13' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="قائمة الرغبات"
                >
                  <Heart size={20} fill={inWishlist ? '#071b13' : 'none'} />
                </button>
              </div>

              <button
                onClick={handleFullDetails}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gold-400)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  padding: '0.4rem'
                }}
              >
                <span>الانتقال لصفحة المنتج وقراءة آراء العميلات</span>
                <ArrowLeft size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
