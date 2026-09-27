import React from 'react';
import { useStore } from '../../context/StoreContext';
import { products } from '../../data/products';
import { Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

export const SeasonalCollection: React.FC = () => {
  const { navigateTo, openQuickView, formatPrice } = useStore();
  const signatureDress = products.find((p) => p.id === 'momen-emerald-dress-01') || products[0];

  return (
    <section
      id="seasonal-collection"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#0c261b',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background radial gold glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(23, 67, 48, 0.6) 0%, rgba(7, 27, 19, 0.85) 100%)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}
        >
          {/* Text & Narrative Content */}
          <div>
            <div className="badge-gold" style={{ marginBottom: '1.25rem' }}>
              <Sparkles size={14} />
              <span>الإصدار الملكي المحدود — ربيع وصيف 2026</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '1.25rem'
              }}
            >
              مجموعة <span className="text-gold-gradient">الزمرد الملكية</span> <br />
              The Royal Emerald
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.75rem'
              }}
            >
              صممت هذه المجموعة تكريماً للأصالة والجمال الخالد. استلهمنا درجات الأخضر الزمردي والمريمية الزيتونية من الطبيعة الخلابة ودمجناها بأفخر خامات الحرير الساتان والكريب المعالج لتمنحك إطلالة لا تضاهى.
            </p>

            {/* Quality Pillars */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>حرير ساتان طبيعي</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ملمس فائق النعومة وانسياب مريح</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>حياكة كوتور دقيقة</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>تشطيبات يدوية بمواصفات عالمية</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>علبة إهداء فاخرة</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>حقيبة مؤمن سنتر المخملية المذهبة</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--gold-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>ضمان الرضا والاستبدال</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>معاينة مجانية عند الاستلام</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => openQuickView(signatureDress)} className="btn-primary">
                <span>اطلبي فستان الزمرد الآن</span>
                <span className="font-editorial" style={{ marginRight: '0.35rem' }}>({formatPrice(signatureDress.price)})</span>
              </button>
              <button onClick={() => navigateTo('shop', undefined, 'dresses')} className="btn-secondary">
                <span>تصفحي فساتين المجموعة</span>
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>

          {/* Visual Showcase (Frames from the sequence) */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                border: '1.5px solid var(--gold-500)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.25)',
                position: 'relative'
              }}
            >
              <img
                src="/hero-frames/frame_240.webp"
                alt="فستان الزمرد الملكي - مؤمن سنتر"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />

              {/* Monogram Badge Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  right: '1.5rem',
                  left: '1.5rem',
                  background: 'rgba(7, 27, 19, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    فستان الزمرد الملكي الحريري
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-300)' }}>
                    متوفر بمقاسات من S إلى XXL
                  </span>
                </div>

                <button
                  onClick={() => openQuickView(signatureDress)}
                  className="btn-outline-gold"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  معاينة سريعة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
