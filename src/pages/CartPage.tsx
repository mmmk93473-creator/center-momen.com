import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { SEOHead } from '../components/common/SEOHead';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck, Tag, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    freeShippingThreshold,
    navigateTo,
    formatPrice,
    addToast
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : 80;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'MOMEN10') {
      setDiscountPercent(10);
      addToast('تم تفعيل كود الخصم بنجاح!', 'تم خصم 10% من قيمة مشترياتك', 'gold');
    } else if (clean === 'VIP15') {
      setDiscountPercent(15);
      addToast('تم تفعيل كود كبار العميلات VIP!', 'تم خصم 15% من قيمة مشترياتك', 'gold');
    } else {
      addToast('كود الخصم غير صالح أو منتهي الصلاحية', undefined, 'info');
    }
  };

  return (
    <div style={{ backgroundColor: '#071b13', minHeight: '100vh', padding: '2rem 0 5rem 0' }}>
      <SEOHead title="حقيبة التسوق" description="راجعي اختياراتك من أزياء مؤمن سنتر وأكملي طلبك بكل سهولة وأمان." />

      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="section-tag">
            <span>حقيبتكِ الملكية</span>
          </div>
          <h1 className="section-title">
            سلة <span className="text-gold-gradient">المشتريات</span>
          </h1>
          <p className="section-subtitle">
            {cart.length > 0 ? `لديكِ ${cart.length} قطعة مختارة بعناية في انتظار إتمام طلبك.` : 'حقيبة التسوق فارغة حالياً.'}
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div
            style={{
              background: 'rgba(17, 51, 36, 0.4)',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '5rem 2rem',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--gold-400)'
              }}
            >
              <ShoppingBag size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.75rem' }}>
              لا توجد قطع في حقيبة التسوق
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
              تصفحي مجموعاتنا الراقية من الفساتين، البلوزات، والبليزرات واختاري ما يناسب ذوقكِ الرفيع.
            </p>
            <button onClick={() => navigateTo('shop')} className="btn-primary" style={{ padding: '0.85rem 2.25rem' }}>
              <span>استكشاف المتجر والتشكيلات</span>
              <ArrowLeft size={16} />
            </button>
          </div>
        ) : (
          /* Cart Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '2.5rem',
              alignItems: 'start'
            }}
            className="cart-grid-layout"
          >
            {/* Items Column */}
            <div>
              {/* Free Shipping Alert Banner */}
              <div
                style={{
                  background: 'rgba(17, 51, 36, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Truck size={22} color="var(--gold-400)" />
                <div style={{ flex: 1 }}>
                  {isFreeShipping ? (
                    <span style={{ fontSize: '0.88rem', color: 'var(--color-success)', fontWeight: 600 }}>
                      تهانينا! لقد حصلتِ على شحن مجاني لكافة محافظات مصر 🎉
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      أضيفي قطعاً بقيمة <strong style={{ color: 'var(--gold-300)' }}>{formatPrice(freeShippingThreshold - cartSubtotal)}</strong> إضافية للحصول على <strong>شحن مجاني</strong>.
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                    style={{
                      background: 'rgba(17, 51, 36, 0.45)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '1.25rem',
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      style={{
                        width: '90px',
                        height: '115px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        {item.product.name}
                      </h3>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        <span>المقاس: <strong style={{ color: 'var(--gold-200)' }}>{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>اللون: <strong style={{ color: 'var(--gold-200)' }}>{item.selectedColor}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="font-editorial text-gold-300" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            ({formatPrice(item.product.price)} للقطعة)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          background: 'rgba(7, 27, 19, 0.85)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.3rem 0.6rem'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}
                          aria-label="تقليل"
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700, color: '#ffffff' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}
                          aria-label="زيادة"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(idx)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                        className="hover:text-red-400 hover:border-red-400"
                        title="حذف القطعة"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => navigateTo('shop')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold-400)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <ArrowRight size={16} />
                  <span>متابعة التسوق وإضافة قطع أخرى</span>
                </button>

                <button
                  onClick={clearCart}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                  className="hover:text-red-400"
                >
                  إفراغ السلة
                </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div
              style={{
                background: 'rgba(17, 51, 36, 0.55)',
                border: '1.5px solid var(--border-medium)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                position: 'sticky',
                top: '100px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                ملخص الطلب
              </h3>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  هل لديكِ كود خصم أو قسيمة شراء؟
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(7, 27, 19, 0.8)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Tag size={16} color="var(--gold-400)" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="MOMEN10"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        color: 'var(--gold-300)',
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-outline-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    تطبيق
                  </button>
                </div>
              </form>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>المجموع الفرعي:</span>
                  <span className="font-editorial" style={{ fontWeight: 600 }}>{formatPrice(cartSubtotal)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>تكلفة الشحن والتوصيل:</span>
                  <span>
                    {isFreeShipping ? (
                      <strong style={{ color: 'var(--color-success)' }}>شحن مجاني</strong>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gold-300)', fontWeight: 600 }}>
                    <span>خصم القسيمة ({discountPercent}%):</span>
                    <span className="font-editorial">- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px dashed var(--border-medium)',
                    fontSize: '1.25rem',
                    fontWeight: 800
                  }}
                >
                  <span style={{ color: '#ffffff' }}>الإجمالي النهائي:</span>
                  <span className="font-editorial text-gold-300">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigateTo('checkout')}
                className="btn-primary"
                style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', marginBottom: '1rem' }}
              >
                <span>الانتقال لإتمام الطلب</span>
                <ArrowLeft size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <ShieldCheck size={16} color="var(--gold-400)" />
                <span>خيار الدفع عند الاستلام متاح لجميع المحافظات</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
