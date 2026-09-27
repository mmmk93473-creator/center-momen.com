import React from 'react';
import { Crown, Sparkles, Scissors, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const WhyMomenCenter: React.FC = () => {
  const features = [
    {
      icon: Crown,
      title: 'عراقة وأصالة منذ 1999',
      description: 'أكثر من 25 عاماً من الخبرة والريادة في تصميم الأزياء النسائية الراقية وخدمة أرقى العائلات.'
    },
    {
      icon: Sparkles,
      title: 'أقمشة نقية ومختارة بعناية',
      description: 'نستورد أفخر أنواع الحرير الإيطالي، الكريب الفرنسي، والكتان الطبيعي لنضمن لكِ نعومة ومظهراً فخماً.'
    },
    {
      icon: Scissors,
      title: 'حياكة هوت كوتور دقيقة',
      description: 'فريق من أمهر المصممين والمفصلين يعتنون بكل درزة وتطريز لتنساب القطعة على قوامك بتناسق تام.'
    },
    {
      icon: ShieldCheck,
      title: 'معاينة مجانية عند الاستلام',
      description: 'ثقتكِ أولويتنا: يمكنكِ فتح الشحنة ومعاينة الخامة والمقاس قبل السداد مع خيار الدفع عند الاستلام.'
    },
    {
      icon: Truck,
      title: 'شحن سريع ومجاني',
      description: 'توصيل فوري خلال 24 - 48 ساعة لكافة محافظات ومدن جمهورية مصر العربية.'
    },
    {
      icon: RefreshCw,
      title: 'استبدال واسترجاع سلس',
      description: 'سياسة مرنة للاستبدال والاسترجاع تضمن لكِ تجربة تسوق آمنة ومريحة بنسبة 100%.'
    }
  ];

  return (
    <section
      id="why-momen-center"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#071b13',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>قيمنا ومبادئنا</span>
          </div>
          <h2 className="section-title">
            لماذا تختارين <span className="text-gold-gradient">مؤمن سنتر؟</span>
          </h2>
          <p className="section-subtitle">
            نحن لا نبيع أزياء فحسب، بل نصنع تجربة متكاملة من الفخامة، الثقة، والاهتمام بأدق التفاصيل.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(17, 51, 36, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'all 0.35s ease'
                }}
                className="hover:border-gold-500 hover:shadow-gold"
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid var(--border-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-400)'
                  }}
                >
                  <Icon size={26} />
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {feat.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
