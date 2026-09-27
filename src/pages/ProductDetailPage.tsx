import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { SEOHead } from '../components/common/SEOHead';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Share2,
  Ruler
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    formatPrice,
    addToast,
    products: storeProducts,
  } = useStore();

  const activeProducts = storeProducts && storeProducts.length > 0 ? storeProducts : products;
  const product = activeProducts.find((p) => p.id === selectedProductId) || activeProducts[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');

  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || '');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('تم نسخ رابط المنتج', undefined, 'info');
    }
  };

  // Related products from same category
  const relatedProducts = activeProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ backgroundColor: '#071b13', minHeight: '100vh', padding: '1.5rem 0 5rem 0' }}>
      <SEOHead
        title={product.name}
        description={product.description}
        product={product}
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem'
          }}
          aria-label="مسار التصفح"
        >
          <button onClick={() => navigateTo('home')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} className="hover:text-gold-300">
            الرئيسية
          </button>
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
          <button onClick={() => navigateTo('shop', undefined, product.category)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} className="hover:text-gold-300">
            {product.category === 'dresses' ? 'فساتين' : product.category === 'blouses' ? 'بلوزات' : product.category === 'pants' ? 'بناطيل' : product.category === 'jackets' ? 'جاكيتات' : 'إكسسوارات'}
          </button>
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
          <span style={{ color: 'var(--gold-300)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Product Hero Section (Gallery + Purchase Info) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            marginBottom: '4.5rem',
            alignItems: 'start'
          }}
        >
          {/* Gallery Column */}
          <div>
            {/* Main Stage Image */}
            <div
              style={{
                width: '100%',
                paddingTop: '125%',
                position: 'relative',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: '#0c261b',
                border: '1.5px solid var(--border-subtle)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
                marginBottom: '1rem'
              }}
            >
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Discount Badge */}
              {product.discount && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--gold-500)',
                    color: '#071b13',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  خصم {product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: '75px',
                      height: '95px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImageIdx === idx ? '2px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: activeImageIdx === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img src={img} alt={`${product.name} زاوية ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Actions Column */}
          <div>
            {/* Tag & Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge-gold">
                <Sparkles size={13} />
                <span>تصميم حصري من مؤمن سنتر</span>
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-400)' }}>
                <Star size={16} fill="var(--gold-400)" />
                <span className="font-editorial" style={{ fontWeight: 700, fontSize: '1.05rem' }}>{product.rating}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({product.reviews} تقييم معتمد)</span>
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.25,
                marginBottom: '1rem'
              }}
            >
              {product.name}
            </h1>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="font-editorial text-gold-300" style={{ fontSize: '2rem', fontWeight: 800 }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="font-editorial" style={{ fontSize: '1.25rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              <span style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 600 }}>
                متوفر في المخزون جاهز للشحن الفوري
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Color Variant Picker */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                اللون المختار: <strong style={{ color: 'var(--gold-300)' }}>{selectedColor}</strong>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      background: selectedColor === color.name ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedColor === color.name ? '1.5px solid var(--gold-400)' : '1px solid var(--border-subtle)',
                      color: selectedColor === color.name ? 'var(--gold-200)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.88rem'
                    }}
                  >
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: color.hex, display: 'inline-block' }} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Variant Picker */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  المقاس المختار: <strong style={{ color: 'var(--gold-300)' }}>{selectedSize}</strong>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gold-400)', fontSize: '0.82rem', cursor: 'pointer' }}>
                  <Ruler size={14} />
                  <span>جدول المقاسات القياسي</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.65rem 1.4rem',
                      borderRadius: 'var(--radius-md)',
                      background: selectedSize === size ? 'var(--gold-500)' : 'rgba(255, 255, 255, 0.05)',
                      border: selectedSize === size ? 'none' : '1px solid var(--border-subtle)',
                      color: selectedSize === size ? '#071b13' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {/* Quantity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(17, 51, 36, 0.6)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.75rem'
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem', fontSize: '1.2rem' }}
                >
                  -
                </button>
                <span style={{ minWidth: '35px', textAlign: 'center', fontWeight: 700, color: 'var(--gold-200)', fontSize: '1rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem', fontSize: '1.2rem' }}
                >
                  +
                </button>
              </div>

              {/* Main Add Button */}
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, minWidth: '220px', padding: '0.95rem', fontSize: '1.05rem' }}
              >
                <ShoppingBag size={20} />
                <span>إضافة إلى حقيبة التسوق</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
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

              {/* Share Button */}
              <button
                onClick={handleShare}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="مشاركة المنتج"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust Service Badges */}
            <div
              style={{
                background: 'rgba(17, 51, 36, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={20} color="var(--gold-400)" />
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>شحن فوري خلال 24 - 48 ساعة</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>لكافة محافظات مصر</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} color="var(--gold-400)" />
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>الدفع عند الاستلام</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>معاينة تامة قبل السداد</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RotateCcw size={20} color="var(--gold-400)" />
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0 }}>استبدال مجاني خلال 14 يوماً</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>ضمان رضا العميلات 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Accordion / Tabs (Details, Fabric & Care, Delivery & Returns) */}
        <div
          style={{
            background: 'rgba(17, 51, 36, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            marginBottom: '4.5rem'
          }}
        >
          {/* Tab Header */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                fontWeight: activeTab === 'details' ? 700 : 500,
                color: activeTab === 'details' ? 'var(--gold-300)' : 'var(--text-muted)',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              تفاصيل التصميم
            </button>
            <button
              onClick={() => setActiveTab('fabric')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                fontWeight: activeTab === 'fabric' ? 700 : 500,
                color: activeTab === 'fabric' ? 'var(--gold-300)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              الخامة والعناية
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                fontWeight: activeTab === 'shipping' ? 700 : 500,
                color: activeTab === 'shipping' ? 'var(--gold-300)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              الشحن وسياسة الإرجاع
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                {product.description}
              </p>
              <ul style={{ listStyle: 'disc', paddingRight: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <li>قصة مدروسة بعناية تناسب القوام الشرقي وتمنحه رشاقة ووقاراً.</li>
                <li>حياكة داخلية مزدوجة مع درزات مخفية لمنع أي احتكاك مع البشرة.</li>
                <li>تأتي القطعة مغلفة في حقيبة مؤمن سنتر الفاخرة المقاومة للأتربة.</li>
              </ul>
            </div>
          )}

          {activeTab === 'fabric' && (
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--gold-300)', marginBottom: '0.5rem' }}>مواصفات النسيج:</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{product.fabric}</p>
              <h4 style={{ fontSize: '1rem', color: 'var(--gold-300)', marginBottom: '0.5rem' }}>إرشادات الغسيل والعناية:</h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{product.care}</p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                • <strong>الشحن السريع:</strong> يتم تسليم الطلب خلال 24 - 48 ساعة لكافة مناطق القاهرة والجيزة والإسكندرية، وخلال 48 - 72 ساعة لباقي محافظات الوجهين البحري والقبلي.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                • <strong>الشحن المجاني:</strong> متاح تلقائياً لكافة الطلبات التي تتجاوز قيمتها 2,500 ج.م.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                • <strong>سياسة الإرجاع:</strong> يمكنكِ استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن تكون القطعة في حالتها الأصلية ببطاقة السعر والعلبة الخاصة بها.
              </p>
            </div>
          )}
        </div>

        {/* Recommended & Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="section-tag">
                <span>تنسيقات مقترحة</span>
              </div>
              <h2 className="section-title">
                قد يعجبكِ <span className="text-gold-gradient">أيضاً</span>
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
