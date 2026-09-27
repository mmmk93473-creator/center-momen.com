import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'monogram';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showImageBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  showImageBadge = false,
  className = '',
  onClick,
}) => {

  return (
    <div
      onClick={onClick}
      className={`logo-container inline-flex items-center gap-3 cursor-pointer select-none ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Visual Emblem Badge */}
      {showImageBadge ? (
        <div
          style={{
            width: size === 'sm' ? '36px' : size === 'md' ? '46px' : size === 'lg' ? '60px' : '76px',
            height: size === 'sm' ? '36px' : size === 'md' ? '46px' : size === 'lg' ? '60px' : '76px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid var(--gold-500)',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
            flexShrink: 0,
            background: '#071b13'
          }}
        >
          <img
            src="/images/momen-logo.jpg"
            alt="Mo'men Center Royal Seal"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div
          style={{
            width: size === 'sm' ? '32px' : size === 'md' ? '42px' : size === 'lg' ? '54px' : '70px',
            height: size === 'sm' ? '32px' : size === 'md' ? '42px' : size === 'lg' ? '54px' : '70px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #144432 0%, #071b13 80%)',
            border: '1.5px solid var(--gold-500)',
            boxShadow: '0 0 16px rgba(212, 175, 55, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {/* Ornate Gold MC Emblem SVG */}
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '85%',
              height: '85%',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
            }}
          >
            <defs>
              <linearGradient id="goldLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff2ba" />
                <stop offset="35%" stopColor="#d4af37" />
                <stop offset="70%" stopColor="#f5dc8c" />
                <stop offset="100%" stopColor="#9a7719" />
              </linearGradient>
            </defs>
            <path
              d="M 26 70 C 23 70 22 66 25 61 L 37 28 C 38 25 41 25 43 28 L 50 45 L 57 28 C 59 25 62 25 63 28 L 75 61 C 78 66 77 70 74 70 C 71 70 69 66 68 62 L 59 38 L 52 54 C 51 56 49 56 48 54 L 41 38 L 32 62 C 31 66 29 70 26 70 Z"
              fill="url(#goldLogoGrad)"
            />
            <path
              d="M 52 32 C 67 27 80 36 78 54 C 77 66 65 74 51 73 C 46 72 43 68 46 64 C 49 61 54 65 58 65 C 67 65 71 58 71 51 C 71 41 63 37 54 40 Z"
              fill="url(#goldLogoGrad)"
              opacity="0.95"
            />
          </svg>
        </div>
      )}

      {/* Typography */}
      {variant !== 'monogram' && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.4rem',
              lineHeight: 1.1
            }}
          >
            <span
              className="font-editorial"
              style={{
                fontSize: size === 'sm' ? '1.1rem' : size === 'md' ? '1.35rem' : size === 'lg' ? '1.8rem' : '2.2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ffffff 0%, #f7df94 40%, #d4af37 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.04em'
              }}
            >
              MO'MEN
            </span>
            <span
              className="font-editorial"
              style={{
                fontSize: size === 'sm' ? '1.05rem' : size === 'md' ? '1.3rem' : size === 'lg' ? '1.75rem' : '2.1rem',
                fontWeight: 600,
                color: 'var(--gold-400)',
                letterSpacing: '0.08em'
              }}
            >
              CENTER
            </span>
          </div>

          {variant === 'full' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '0.15rem'
              }}
            >
              <span
                style={{
                  fontSize: size === 'sm' ? '0.65rem' : size === 'md' ? '0.75rem' : '0.85rem',
                  color: 'var(--gold-300)',
                  fontWeight: 500,
                  letterSpacing: '0.05em'
                }}
              >
                مؤمن سنتر للأزياء
              </span>
              <span
                className="font-editorial"
                style={{
                  fontSize: size === 'sm' ? '0.55rem' : size === 'md' ? '0.65rem' : '0.75rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em'
                }}
              >
                EST. 1999
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
