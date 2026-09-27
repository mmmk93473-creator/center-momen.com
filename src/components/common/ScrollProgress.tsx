import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollProgress: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
        setScrollPercent(percent);
      }
      setShowTopBtn(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Gold Reading Line */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '3px',
          width: `${scrollPercent}%`,
          background: 'linear-gradient(90deg, #b88d22 0%, #fdf0b0 50%, #d4af37 100%)',
          zIndex: 10000,
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.7)',
          transition: 'width 80ms ease-out',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Back-To-Top Magnetic Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(11, 35, 25, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid var(--gold-500)',
            color: 'var(--gold-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(212, 175, 55, 0.2)',
            zIndex: 990,
            transition: 'all var(--transition-normal)'
          }}
          className="hover:scale-110 active:scale-95"
          aria-label="العودة لأعلى الصفحة"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
};
