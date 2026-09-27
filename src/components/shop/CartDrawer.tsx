import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    freeShippingThreshold,
    navigateTo,
    formatPrice
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const freeShippingProgress = Math.min((cartSubtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - cartSubtotal, 0);

  const handleCheckout = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  const handleViewCart = () => {
    setIsCartDrawerOpen(false);
    navigateTo('cart');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3500,
        background: 'rgba(5, 20, 14, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'flex-start'
      }}
      onClick={() => setIsCartDrawerOpen(false)}
    >
      {/* Drawer Body (RTL: slides in from right/left as desired) */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'rgba(7, 27, 19, 0.98)',
          borderLeft: '1px solid var(--border-medium)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--gold-400)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              حقيبة التسوق ({cart.length})
            </h3>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: 'var(--gold-300)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="إغلاق حقيبة التسوق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            background: 'rgba(17, 51, 36, 0.5)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
            <Truck size={16} color="var(--gold-400)" />
            {remainingForFreeShipping > 0 ? (
              <span style={{ color: 'var(--text-secondary)' }}>
                أضيفي <strong style={{ color: 'var(--gold-300)' }}>{formatPrice(remainingForFreeShipping)}</strong> للحصول على <strong>شحن مجاني</strong>
              </span>
            ) : (
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                تهانينا! لقد حصلتِ على شحن مجاني لكافة محافظات مصر 🎉
              </span>
            )}
          </div>

          <div
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'var(--gradient-gold)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}
              >
                <ShoppingBag size={30} color="var(--gold-400)" />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                حقيبة التسوق فارغة
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                استكشفي أحدث فساتين وتصاميم الهوت كوتور الفاخرة من مؤمن سنتر.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigateTo('shop');
                }}
                className="btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem' }}
              >
                تصفحي التشكيلة الآن
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  style={{
                    background: 'rgba(17, 51, 36, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'flex',
                    gap: '0.85rem',
                    position: 'relative'
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{
                      width: '70px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: '0.2rem',
                            paddingLeft: '1rem'
                          }}
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                          className="hover:text-red-400"
                          aria-label="حذف المنتج"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span>المقاس: <strong>{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span>اللون: <strong>{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <span className="font-editorial" style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1rem' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'rgba(7, 27, 19, 0.8)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '0.15rem 0.4rem'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                          aria-label="تقليل الكمية"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                          aria-label="زيادة الكمية"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Totals & CTA */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(7, 27, 19, 0.95)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>المجموع الفرعي:</span>
              <span className="font-editorial" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatPrice(cartSubtotal)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>الشحن:</span>
              <span>
                {cartSubtotal >= freeShippingThreshold ? (
                  <strong style={{ color: 'var(--color-success)' }}>مجاني</strong>
                ) : (
                  '80 ج.م'
                )}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px dashed var(--border-subtle)',
                marginBottom: '1.25rem',
                fontSize: '1.15rem',
                fontWeight: 700
              }}
            >
              <span>الإجمالي التقديري:</span>
              <span className="font-editorial text-gold-300">
                {formatPrice(cartSubtotal + (cartSubtotal >= freeShippingThreshold ? 0 : 80))}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                <span>إتمام الطلب (الدفع عند الاستلام)</span>
                <ArrowLeft size={16} />
              </button>

              <button onClick={handleViewCart} className="btn-secondary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem' }}>
                <span>عرض سلة المشتريات بالكامل</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
