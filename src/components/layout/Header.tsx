import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';
import { Search, Heart, ShoppingBag, Menu, X, Sparkles, PhoneCall } from 'lucide-react';
import type { CategoryId } from '../../types/product';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setSelectedCategoryFilter
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route: string, category?: CategoryId | 'all') => {
    setMobileMenuOpen(false);
    if (category) {
      setSelectedCategoryFilter(category);
      navigateTo('shop', undefined, category);
    } else {
      navigateTo(route);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #071b13 0%, #113827 50%, #071b13 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '0.45rem 1rem',
          fontSize: '0.8rem',
          color: 'var(--gold-200)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.75rem',
          position: 'relative',
          zIndex: 1001,
          textAlign: 'center'
        }}
      >
        <Sparkles size={13} color="var(--gold-400)" />
        <span>شحن مجاني لكافة محافظات مصر على الطلبات فوق 2,500 ج.م | كود خصم إضافي 10%: <strong className="font-editorial text-gold-300">MOMEN10</strong></span>
        <Sparkles size={13} color="var(--gold-400)" />
      </div>

      {/* Main Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: isScrolled
            ? 'rgba(7, 27, 19, 0.94)'
            : 'rgba(7, 27, 19, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled
            ? '1px solid rgba(212, 175, 55, 0.25)'
            : '1px solid rgba(212, 175, 55, 0.1)',
          boxShadow: isScrolled
            ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.1)'
            : 'none',
          padding: isScrolled ? '0.7rem 0' : '1.1rem 0'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--gold-300)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            className="mobile-menu-trigger"
            aria-label="فتح القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo with Emblem & Typography */}
          <Logo
            size={isScrolled ? 'sm' : 'md'}
            variant="full"
            onClick={() => handleNavClick('home')}
          />

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.6rem'
            }}
            className="desktop-nav"
            aria-label="التنقل الرئيسي"
          >
            <button
              onClick={() => handleNavClick('home')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: currentRoute === 'home' ? 700 : 500,
                color: currentRoute === 'home' ? 'var(--gold-400)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
                position: 'relative'
              }}
              className="nav-link"
            >
              الرئيسية
              {currentRoute === 'home' && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--gold-500)',
                    borderRadius: '2px'
                  }}
                />
              )}
            </button>

            <button
              onClick={() => handleNavClick('shop', 'all')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color var(--transition-fast)'
              }}
              className="nav-link"
            >
              وصل حديثًا
            </button>

            <button
              onClick={() => handleNavClick('shop', 'dresses')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              فساتين
            </button>

            <button
              onClick={() => handleNavClick('shop', 'blouses')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              بلوزات
            </button>

            <button
              onClick={() => handleNavClick('shop', 'pants')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              بناطيل
            </button>

            <button
              onClick={() => handleNavClick('shop', 'jackets')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              جاكيتات
            </button>

            <button
              onClick={() => handleNavClick('shop', 'accessories')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.92rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              className="nav-link"
            >
              إكسسوارات
            </button>

            <button
              onClick={() => handleNavClick('shop', 'all')}
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: 'var(--gold-300)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              العروض
            </button>
          </nav>

          {/* Action Icons (Search, Wishlist, Cart) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover:border-gold-500 hover:text-gold-300"
              aria-label="البحث عن منتج"
            >
              <Search size={18} />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('wishlist')}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: wishlist.length > 0 ? 'var(--gold-400)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              className="hover:border-gold-500 hover:text-gold-300"
              aria-label="قائمة الرغبات"
            >
              <Heart size={18} fill={wishlist.length > 0 ? 'var(--gold-500)' : 'none'} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--gold-500)',
                    color: '#071b13',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 6px rgba(212, 175, 55, 0.8)'
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--gradient-gold)',
                border: 'none',
                color: '#071b13',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s ease'
              }}
              aria-label={`حقيبة التسوق بها ${cartCount} عناصر`}
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">الحقيبة</span>
              <span
                style={{
                  background: '#071b13',
                  color: 'var(--gold-300)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(5, 20, 14, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem 1.5rem',
            overflowY: 'auto'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <Logo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'var(--gold-300)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="إغلاق القائمة"
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <button
                onClick={() => handleNavClick('home')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                الرئيسية
              </button>
              <button
                onClick={() => handleNavClick('shop', 'all')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                وصل حديثًا
              </button>
              <button
                onClick={() => handleNavClick('shop', 'dresses')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--gold-300)', cursor: 'pointer' }}
              >
                فساتين
              </button>
              <button
                onClick={() => handleNavClick('shop', 'blouses')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                بلوزات
              </button>
              <button
                onClick={() => handleNavClick('shop', 'pants')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                بناطيل
              </button>
              <button
                onClick={() => handleNavClick('shop', 'jackets')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                جاكيتات
              </button>
              <button
                onClick={() => handleNavClick('shop', 'accessories')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                إكسسوارات
              </button>
              <button
                onClick={() => handleNavClick('wishlist')}
                style={{ background: 'transparent', border: 'none', textAlign: 'right', fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                قائمة الرغبات ({wishlist.length})
              </button>
            </div>
          </div>

          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--gold-400)' }}>
              <PhoneCall size={18} />
              <span style={{ fontSize: '0.9rem' }}>خدمة العملاء والواتساب: 01000000000</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              MOMEN CENTER — فروعنا ومقرنا الرئيسي بالقاهرة، مصر. شحن فوري لكافة المحافظات.
            </p>
          </div>
        </div>
      )}

      {/* Responsive CSS for Header */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-trigger {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
