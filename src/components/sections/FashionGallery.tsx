import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag } from 'lucide-react';

export const FashionGallery: React.FC = () => {
  const { navigateTo } = useStore();

  const galleryItems = [
    {
      img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      title: 'إطلالة الزمرد الملكي',
      tag: '#MomenCenterGown'
    },
    {
      img: 'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?q=80&w=800&auto=format&fit=crop',
      title: 'بليزر الكوتور الباريسي',
      tag: '#MomenBlazer'
    },
    {
      img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop',
      title: 'أمسية المخمل الأسود',
      tag: '#VelvetNight'
    },
    {
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      title: 'حقيبة الجلد الإيطالي MC',
      tag: '#SignatureTote'
    },
    {
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      title: 'انسياب القفطان التراثي',
      tag: '#RoyalKaftan'
    },
    {
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      title: 'بالازو الحرير العاجي',
      tag: '#SilkPalazzo'
    }
  ];

  return (
    <section
      id="fashion-gallery"
      style={{
        padding: 'var(--space-4xl) 0',
        backgroundColor: '#0c261b',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <span>مجتمع مؤمن سنتر</span>
          </div>
          <h2 className="section-title">
            معرض الأناقة <span className="text-gold-gradient">#MomenStyle</span>
          </h2>
          <p className="section-subtitle">
            تابعي حسابنا على إنستغرام وشاركينا إطلالتكِ الملكية مع وسم #MomenCenter لتظهري في معرضنا الأسبوعي.
          </p>
        </div>

        {/* 6-Item Masonry/Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigateTo('shop')}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                paddingTop: '125%',
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#071b13'
              }}
              className="group"
            >
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="group-hover:scale-110"
              />

              {/* Hover Dark Overlay with Shoppable Tag */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(7, 27, 19, 0.1) 0%, rgba(7, 27, 19, 0.85) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.25rem'
                }}
                className="group-hover:opacity-100"
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-300)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', fontWeight: 600 }}>
                    {item.tag}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0, marginTop: '2px' }}>
                    {item.title}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-300)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                    <ShoppingBag size={12} />
                    <span>تسوّقي القطعة</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
