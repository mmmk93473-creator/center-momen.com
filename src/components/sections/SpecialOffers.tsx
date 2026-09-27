import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { products } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { Sparkles, Copy, Check } from 'lucide-react';

export const SpecialOffers: React.FC = () => {
  const { addToast } = useStore();
  const [copied, setCopied] = useState(false);

  // Live countdown timer to midnight / next flash sale end
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('MOMEN10');
    setCopied(true);
    addToast('تم نسخ كود الخصم', 'استخدمي MOMEN10 عند الدفع لخصم 10% إضافي', 'gold');
    setTimeout(() => setCopied(false), 2500);
  };

  const discountItems = products.filter((p) => p.discount && p.discount > 0).slice(0, 4);

  return (
    <section
      id="special-offers"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#0c261b',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Deal Header with Countdown Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(23, 67, 48, 0.7) 0%, rgba(7, 27, 19, 0.9) 100%)',
            border: '1.5px solid var(--gold-500)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem 2.5rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.15)'
          }}
        >
          <div>
            <div className="badge-gold" style={{ marginBottom: '0.6rem' }}>
              <Sparkles size={14} />
              <span>عروض خاصة ومحدودة</span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
              خصم حتى 20% + 10% إضافي بكود <span className="font-editorial text-gold-300">MOMEN10</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
              استفيدي من أسعارنا الحصرية لفترة محدودة على أرقى قطع وتصاميم الهوت كوتور.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Countdown Blocks */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  background: 'rgba(7, 27, 19, 0.9)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  textAlign: 'center',
                  minWidth: '55px'
                }}
              >
                <span className="font-editorial" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-300)', display: 'block' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ساعة</span>
              </div>
              <span style={{ color: 'var(--gold-400)', fontWeight: 700 }}>:</span>
              <div
                style={{
                  background: 'rgba(7, 27, 19, 0.9)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  textAlign: 'center',
                  minWidth: '55px'
                }}
              >
                <span className="font-editorial" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-300)', display: 'block' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>دقيقة</span>
              </div>
              <span style={{ color: 'var(--gold-400)', fontWeight: 700 }}>:</span>
              <div
                style={{
                  background: 'rgba(7, 27, 19, 0.9)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.8rem',
                  textAlign: 'center',
                  minWidth: '55px'
                }}
              >
                <span className="font-editorial" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-300)', display: 'block' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ثانية</span>
              </div>
            </div>

            {/* Voucher Copy Button */}
            <button
              onClick={handleCopyCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: copied ? 'var(--color-success)' : 'var(--gradient-gold)',
                color: '#071b13',
                border: 'none',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? 'تم النسخ!' : 'انسخي كود MOMEN10'}</span>
            </button>
          </div>
        </div>

        {/* Discounted Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {discountItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
