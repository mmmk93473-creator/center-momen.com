import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import type { CategoryId } from '../../types/product';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategoryFilter } = useStore();

  const handleCategoryClick = (cat: CategoryId) => {
    setSelectedCategoryFilter(cat);
    navigateTo('shop', undefined, cat);
  };

  return (
    <footer
      style={{
        backgroundColor: '#05140e',
        borderTop: '1.5px solid var(--border-medium)',
        color: 'var(--text-secondary)',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-2xl)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Top Columns Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3.5rem'
          }}
        >
          {/* Column 1: Brand & Heritage */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Logo size="md" variant="full" onClick={() => navigateTo('home')} />
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
              دار أزياء نسائية فاخرة تأسست عام 1999. نبتكر تصاميم هوت كوتور تجمع بين الأصالة العربية والتجدد العصري، بأجود خامات الحرير والكريب العالمية.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a
                href="#instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--gold-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                className="hover:border-gold-500 hover:text-gold-300"
                aria-label="تابعونا على إنستغرام"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--gold-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                className="hover:border-gold-500 hover:text-gold-300"
                aria-label="تابعونا على فيسبوك"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', position: 'relative' }}>
              الأقسام والتشكيلات
              <span style={{ position: 'absolute', bottom: '-6px', right: 0, width: '28px', height: '2px', background: 'var(--gold-500)' }} />
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <button
                  onClick={() => handleCategoryClick('dresses')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', padding: 0 }}
                  className="hover:text-gold-300"
                >
                  فساتين سهرة ومناسبات
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('blouses')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', padding: 0 }}
                  className="hover:text-gold-300"
                >
                  بلوزات وتوبات حريرية
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('pants')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', padding: 0 }}
                  className="hover:text-gold-300"
                >
                  بناطيل بالازو وكلاسيك
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('jackets')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', padding: 0 }}
                  className="hover:text-gold-300"
                >
                  جاكيتات وبليزرات كوتور
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('accessories')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', cursor: 'pointer', padding: 0 }}
                  className="hover:text-gold-300"
                >
                  حقائب وإكسسوارات فاخرة
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', position: 'relative' }}>
              خدمة العميلات
              <span style={{ position: 'absolute', bottom: '-6px', right: 0, width: '28px', height: '2px', background: 'var(--gold-500)' }} />
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <button onClick={() => navigateTo('cart')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }} className="hover:text-gold-300">
                  سلة المشتريات
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }} className="hover:text-gold-300">
                  قائمة الرغبات المحفوظة
                </button>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>سياسة الاستبدال والاسترجاع (14 يوماً)</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>دليل ومقاسات الأزياء القياسية</span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>الشحن والتوصيل لكافة المحافظات</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Showroom */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', position: 'relative' }}>
              معارضنا والتواصل
              <span style={{ position: 'absolute', bottom: '-6px', right: 0, width: '28px', height: '2px', background: 'var(--gold-500)' }} />
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>القاهرة — فروعنا ومقرنا الرئيسي بجمهورية مصر العربية</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                <span dir="ltr" className="font-editorial" style={{ color: 'var(--gold-200)', fontWeight: 600 }}>
                  +20 100 000 0000
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="var(--gold-400)" style={{ flexShrink: 0 }} />
                <span className="font-editorial">concierge@momencenter.com</span>
              </li>
              <li style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                مواعيد العمل: يومياً من 10:00 صباحاً حتى 11:00 مساءً
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Badges & Trust Line */}
        <div
          style={{
            padding: '1.5rem 0',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-300)', fontSize: '0.88rem', fontWeight: 600 }}>
            <ShieldCheck size={20} color="var(--gold-400)" />
            <span>تسوق آمن وموثوق 100% | خيار الدفع نقداً عند الاستلام</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>وسائل الدفع المعتمدة:</span>
            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--gold-200)', border: '1px solid var(--border-subtle)' }}>
              الدفع عند الاستلام (COD)
            </span>
            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--gold-200)', border: '1px solid var(--border-subtle)' }}>
              Visa
            </span>
            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--gold-200)', border: '1px solid var(--border-subtle)' }}>
              MasterCard
            </span>
            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--gold-200)', border: '1px solid var(--border-subtle)' }}>
              ميزة Meeza
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            paddingTop: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-dim)'
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong className="font-editorial text-gold-300">MOMEN CENTER</strong>. جميع الحقوق محفوظة لدار مؤمن سنتر للأزياء النسائية.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>صُنع بشغف للأناقة والجمال</span>
              <Heart size={14} color="var(--gold-500)" fill="var(--gold-500)" />
            </div>

            <a
              href="#admin/login"
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                opacity: 0.4,
                transition: 'opacity 0.2s ease',
              }}
              className="hover:opacity-100 hover:text-gold-400"
              title="بوابة إدارة المتجر"
            >
              <span>🔒 بوابة الإدارة</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
