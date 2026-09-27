import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, openQuickView, addToCart, toggleWishlist, isInWishlist, formatPrice } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;

  const handleCardClick = () => {
    navigateTo('product', product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0].name, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(17, 51, 36, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 16px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)'
          : '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}
      className="product-card group"
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '130%', // Luxury 3:4 portrait aspect ratio
          overflow: 'hidden',
          backgroundColor: '#071b13'
        }}
      >
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
            transform: isHovered && hasSecondaryImage ? 'scale(1.06)' : isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: isHovered && hasSecondaryImage ? 0 : 1
          }}
        />

        {/* Secondary Hover Image */}
        {hasSecondaryImage && (
          <img
            src={product.images[1]}
            alt={`${product.name} إطلالة بديلة`}
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              opacity: isHovered ? 1 : 0
            }}
          />
        )}

        {/* Top Badges (Discount, Best Seller, New) */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            zIndex: 2
          }}
        >
          {product.discount && (
            <span
              style={{
                background: 'var(--gold-500)',
                color: '#071b13',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-xs)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              خصم {product.discount}%
            </span>
          )}
          {product.newArrival && (
            <span
              style={{
                background: 'rgba(7, 27, 19, 0.85)',
                color: 'var(--gold-300)',
                border: '1px solid var(--border-medium)',
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
                backdropFilter: 'blur(6px)'
              }}
            >
              جديد
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: inWishlist ? 'var(--gold-500)' : 'rgba(7, 27, 19, 0.75)',
            border: inWishlist ? 'none' : '1px solid var(--border-subtle)',
            color: inWishlist ? '#071b13' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.25s ease',
            zIndex: 2
          }}
          className="hover:scale-110"
          aria-label={inWishlist ? 'إزالة من قائمة الرغبات' : 'إضافة إلى قائمة الرغبات'}
        >
          <Heart size={16} fill={inWishlist ? '#071b13' : 'none'} />
        </button>

        {/* Hover Action Bar (Quick View & Fast Add) */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            gap: '0.5rem',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 2
          }}
        >
          <button
            onClick={handleQuickView}
            style={{
              flex: 1,
              background: 'rgba(7, 27, 19, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-medium)',
              color: 'var(--gold-300)',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
            className="hover:bg-gold-500 hover:text-emerald-950"
          >
            <Eye size={14} />
            <span>نظرة سريعة</span>
          </button>

          <button
            onClick={handleQuickAdd}
            style={{
              background: 'var(--gradient-gold)',
              border: 'none',
              color: '#071b13',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
            }}
            className="hover:brightness-110"
            title="إضافة سريعة للحقيبة"
          >
            <ShoppingBag size={14} />
            <span>إضافة</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Rating & Fabric line */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold-300)', fontWeight: 500 }}>
              {product.fabric.split('مع')[0]}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gold-400)', fontSize: '0.75rem' }}>
              <Star size={12} fill="var(--gold-400)" />
              <span className="font-editorial" style={{ fontWeight: 600 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>({product.reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '0.96rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.4,
              marginBottom: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Colors preview */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="font-editorial" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold-300)' }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="font-editorial" style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color variant dots */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {product.colors.slice(0, 3).map((col) => (
              <span
                key={col.name}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: col.hex,
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                title={col.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
