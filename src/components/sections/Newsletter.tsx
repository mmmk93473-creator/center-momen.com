import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Mail, Sparkles, Check, ArrowLeft } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('يرجى إدخال بريد إلكتروني صحيح', undefined, 'info');
      return;
    }

    setSubscribed(true);
    addToast('مرحباً بكِ في نادي كبار العميلات VIP', 'تم إرسال كود ترحيبي 15% إلى بريدكِ الإلكتروني', 'gold');
    setEmail('');
  };

  return (
    <section
      id="newsletter"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#071b13',
        position: 'relative'
      }}
    >
      <div className="container" style={{ maxWidth: '850px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(23, 67, 48, 0.6) 0%, rgba(11, 35, 25, 0.8) 100%)',
            border: '1.5px solid var(--gold-500)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Sparkle Badge */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--gold-400)'
            }}
          >
            <Sparkles size={28} />
          </div>

          <span
            className="font-editorial"
            style={{
              color: 'var(--gold-400)',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}
          >
            MOMEN CENTER VIP PRIVILEGES
          </span>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '1rem'
            }}
          >
            انضمي إلى نادي <span className="text-gold-gradient">كبار العميلات</span>
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto 2rem auto'
            }}
          >
            كوني أول من يطّلع على مجموعاتنا الجديدة، والعروض الحصرية المغلقة، مع هدية ترحيبية فورية: <strong>خصم 15% على أول طلب</strong>.
          </p>

          {subscribed ? (
            <div
              style={{
                background: 'rgba(46, 196, 182, 0.15)',
                border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-primary)'
              }}
            >
              <Check size={22} color="var(--color-success)" />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                  تم اشتراكك بنجاح في نادي VIP!
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--gold-200)', margin: 0, marginTop: '2px' }}>
                  استخدمي كود <strong>VIP15</strong> عند إتمام طلبك القادم.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: '0.75rem',
                maxWidth: '520px',
                margin: '0 auto',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: '260px',
                  background: 'rgba(7, 27, 19, 0.85)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.75rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Mail size={18} color="var(--gold-400)" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخلي بريدكِ الإلكتروني..."
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.75rem 1.85rem' }}
              >
                <span>انضمام فوري</span>
                <ArrowLeft size={16} />
              </button>
            </form>
          )}

          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1.25rem' }}>
            نحترم خصوصيتكِ تماماً. يمكنكِ إلغاء الاشتراك في أي وقت بنقرة واحدة.
          </p>
        </div>
      </div>
    </section>
  );
};
