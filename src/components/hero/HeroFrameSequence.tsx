import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { products } from '../../data/products';
import { ChevronDown, Play, Pause, RotateCw, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';

interface HeroFrameSequenceProps {
  onScrollToNext: () => void;
}

const TOTAL_FRAMES = 240;
const INITIAL_BURST_COUNT = 24;

export const HeroFrameSequence: React.FC<HeroFrameSequenceProps> = ({ onScrollToNext }) => {
  const { openQuickView, navigateTo } = useStore();
  const signatureDress = products.find((p) => p.id === 'momen-emerald-dress-01') || products[0];

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Responsive state ref to avoid stale closures in RAF loop
  const isMobileRef = useRef<boolean>(typeof window !== 'undefined' && window.innerWidth <= 768);

  // Frame Cache & State (Mutable refs for RAF performance without re-render lag)
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);
  const isReducedMotionRef = useRef<boolean>(false);

  // Component UI State
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<number>(1); // 1, 2, 3, 4
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartFrameRef = useRef<number>(1);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotionRef.current = mediaQuery.matches;

    const handler = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Frame URL Resolver: Selects Desktop 1280x720 HQ or Mobile 854x480 optimized WebP
  const getFrameUrl = useCallback((idx: number, mobile: boolean) => {
    const pad = String(idx).padStart(3, '0');
    const folder = mobile ? '/hero-frames-mobile' : '/hero-frames';
    return `${folder}/frame_${pad}.webp`;
  }, []);

  // Preload surrounding frames for prioritized responsiveness on scrub
  const preloadSurroundingFrames = useCallback((centerFrame: number) => {
    const mobile = isMobileRef.current;
    const start = Math.max(1, centerFrame - 8);
    const end = Math.min(TOTAL_FRAMES, centerFrame + 18);
    for (let i = start; i <= end; i++) {
      const img = imagesRef.current[i - 1];
      if (img && !img.src) {
        img.src = getFrameUrl(i, mobile);
      }
    }
  }, [getFrameUrl]);

  // Preload frames progressively with intelligent batching
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const mobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    isMobileRef.current = mobile;

    const images: HTMLImageElement[] = [];

    // Pre-allocate array of 240 frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      images.push(img);
    }
    imagesRef.current = images;

    // Load initial burst for instantaneous first visual
    let burstLoaded = 0;
    for (let i = 1; i <= INITIAL_BURST_COUNT; i++) {
      const img = images[i - 1];
      img.src = getFrameUrl(i, mobile);
      img.onload = () => {
        if (!isMounted) return;
        burstLoaded++;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

        if (burstLoaded >= Math.min(8, INITIAL_BURST_COUNT)) {
          setIsInitialReady(true);
          renderFrame(1);
        }
      };
      img.onerror = () => {
        if (!isMounted) return;
        burstLoaded++;
        loadedCount++;
      };
    }

    // Load remaining frames in background idle chunks (16 frames per idle frame)
    let remainingIndex = INITIAL_BURST_COUNT + 1;
    const loadNextBatch = () => {
      if (!isMounted || remainingIndex > TOTAL_FRAMES) return;

      const batchSize = 16;
      const end = Math.min(remainingIndex + batchSize, TOTAL_FRAMES + 1);

      for (let i = remainingIndex; i < end; i++) {
        const img = images[i - 1];
        if (!img.src) {
          img.src = getFrameUrl(i, mobile);
          img.onload = () => {
            if (!isMounted) return;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          };
          img.onerror = () => {
            if (!isMounted) return;
            loadedCount++;
          };
        }
      }

      remainingIndex = end;
      if (remainingIndex <= TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 350 });
        } else {
          setTimeout(loadNextBatch, 60);
        }
      }
    };

    setTimeout(loadNextBatch, 100);

    return () => {
      isMounted = false;
    };
  }, [getFrameUrl]);

  // High-Quality Canvas Frame Renderer
  const renderFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameIndex = Math.min(Math.max(Math.round(frameNumber) - 1, 0), TOTAL_FRAMES - 1);
    const img = imagesRef.current[frameIndex];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame fallback for jitter-free visual continuity
      for (let offset = 1; offset < 24; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          drawScaledImage(ctx, canvas, prev);
          return;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          drawScaledImage(ctx, canvas, next);
          return;
        }
      }
      return;
    }

    drawScaledImage(ctx, canvas, img);
  }, []);

  // Draw scaled image with 100% authentic source color fidelity & high-DPI precision
  const drawScaledImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1280;
    const ih = img.naturalHeight || 720;

    // Neutral deep studio dark background (neutral black/charcoal, no artificial green tint)
    ctx.fillStyle = '#060907';
    ctx.fillRect(0, 0, cw, ch);

    // Calculate aspect ratio cover
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const nw = iw * ratio;
    const nh = ih * ratio;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    // High quality bicubic filtering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the source frame with 100% original video pixels and true colors
    ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);

    // Subtle neutral bottom gradient strictly for editorial text legibility at the bottom
    // NO green overlays, NO color cast, NO hue rotation
    const bottomVignette = ctx.createLinearGradient(0, ch * 0.72, 0, ch);
    bottomVignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    bottomVignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = bottomVignette;
    ctx.fillRect(0, ch * 0.72, cw, ch * 0.28);
  };

  // High-DPI Canvas Resize Handler
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update mobile flag
      const wasMobile = isMobileRef.current;
      const nowMobile = width <= 768;
      isMobileRef.current = nowMobile;

      // Internal canvas resolution accounts for Retina / high-DPI displays
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      // If viewport crossed mobile breakpoint, update URLs for subsequent lazy loads
      if (wasMobile !== nowMobile) {
        imagesRef.current.forEach((img, idx) => {
          if (img.src) {
            img.src = getFrameUrl(idx + 1, nowMobile);
          }
        });
      }

      renderFrame(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [renderFrame, getFrameUrl]);

  // Main Scroll Progress & RAF Loop with Smooth Lerping
  useEffect(() => {
    let lastRenderedFrame = -1;

    const tick = () => {
      if (!isAutoplaying) {
        // Interpolate current frame towards target frame for silky smooth motion
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.05) {
          currentFrameRef.current += diff * 0.18;
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }
      } else {
        // Autoplay mode
        currentFrameRef.current = (currentFrameRef.current % TOTAL_FRAMES) + 0.6;
        targetFrameRef.current = currentFrameRef.current;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastRenderedFrame) {
        renderFrame(frameToDraw);
        lastRenderedFrame = frameToDraw;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [renderFrame, isAutoplaying]);

  // Window Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      if (isAutoplaying || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollY = -rect.top;
      const totalScrollable = container.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.min(Math.max(scrollY / totalScrollable, 0), 1);

      // Target frame mapping (1 to 240)
      const mappedFrame = Math.min(Math.max(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1, 1), TOTAL_FRAMES);
      targetFrameRef.current = mappedFrame;
      preloadSurroundingFrames(mappedFrame);

      // Update Phase for narrative text choreography
      if (progress < 0.25) {
        setActivePhase(1);
      } else if (progress < 0.58) {
        setActivePhase(2);
      } else if (progress < 0.85) {
        setActivePhase(3);
      } else {
        setActivePhase(4);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAutoplaying, preloadSurroundingFrames]);

  // Touch / Mouse Drag Scrubbing on Canvas
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = currentFrameRef.current;
    if (isAutoplaying) setIsAutoplaying(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Scrub sensitivity: 3.5px per frame for 240 frames
    const frameShift = -deltaX / 3.5;
    let nextFrame = ((dragStartFrameRef.current + frameShift - 1) % TOTAL_FRAMES) + 1;
    if (nextFrame < 1) nextFrame += TOTAL_FRAMES;
    const rounded = Math.round(nextFrame);
    targetFrameRef.current = rounded;
    preloadSurroundingFrames(rounded);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      id="hero-scroll-container"
      style={{
        position: 'relative',
        height: '380vh', // ample scroll distance for smooth scrubbing of 240 frames
        width: '100%',
        backgroundColor: '#060907'
      }}
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none'
          }}
          aria-label="تسلسل صور فستان مؤمن سنتر ثلاثي الأبعاد"
        />

        {/* Ambient Subtle Luxury Lighting Glows (Neutral Warm Gold - No Green Cast) */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            right: '12%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />

        {/* Initial Loading State with subtle luxury progress indicator */}
        {!isInitialReady && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#060907',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '2rem'
            }}
          >
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--gold-500)',
                  animation: 'pulseGold 2s infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={28} color="var(--gold-400)" />
              </div>
            </div>
            <h2
              className="font-editorial"
              style={{
                fontSize: '1.75rem',
                letterSpacing: '0.1em',
                background: 'var(--gradient-gold)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}
            >
              MOMEN CENTER
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              جاري تجهيز التجربة السينمائية الفاخرة...
            </p>
            <div
              style={{
                width: '180px',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${loadProgress}%`,
                  height: '100%',
                  background: 'var(--gradient-gold)',
                  transition: 'width 200ms ease'
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)', marginTop: '0.5rem' }}>
              {loadProgress}%
            </span>
          </div>
        )}

        {/* CHOREOGRAPHED EDITORIAL OVERLAYS */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'calc(var(--space-2xl) + 2rem) var(--space-xl) var(--space-xl) var(--space-xl)',
            zIndex: 10
          }}
        >
          {/* Top Brand Subtitle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: '1280px',
              margin: '0 auto',
              opacity: isInitialReady ? 1 : 0,
              transition: 'opacity 0.8s ease'
            }}
          >
            <div className="badge-gold">
              <Sparkles size={14} />
              <span>مجموعة ربيع وصيف 2026 الحصرية</span>
            </div>

            {/* Quick 360 & Autoplay controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                pointerEvents: 'auto'
              }}
            >
              <button
                onClick={() => setIsAutoplaying(!isAutoplaying)}
                style={{
                  background: isAutoplaying ? 'var(--gold-500)' : 'rgba(7, 27, 19, 0.8)',
                  color: isAutoplaying ? '#071b13' : 'var(--gold-300)',
                  border: '1px solid var(--gold-500)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease'
                }}
                title={isAutoplaying ? 'إيقاف الدوران التلقائي' : 'تشغيل الدوران التلقائي'}
              >
                {isAutoplaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isAutoplaying ? 'إيقاف الدوران' : 'دوران سينمائي'}</span>
              </button>

              <div
                style={{
                  background: 'rgba(7, 27, 19, 0.75)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <RotateCw size={13} color="var(--gold-400)" />
                <span className="hidden sm:inline">اسحبي للمعاينة 360°</span>
                <span className="font-editorial text-gold-300 font-semibold">
                  {Math.round((currentFrameRef.current / TOTAL_FRAMES) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Central Choreographed Text Content per Phase */}
          <div
            style={{
              width: '100%',
              maxWidth: '1280px',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              minHeight: '260px'
            }}
          >
            {/* PHASE 1: Initial Presentation (0% - 25%) */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                maxWidth: '560px',
                textAlign: 'right',
                opacity: activePhase === 1 ? 1 : 0,
                transform: activePhase === 1 ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: activePhase === 1 ? 'auto' : 'none'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--gold-400)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  letterSpacing: '0.05em'
                }}
              >
                <span style={{ width: '24px', height: '1px', background: 'var(--gold-500)' }} />
                <span>دار الأزياء المصرية الراقية منذ 1999</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: '1rem',
                  color: '#ffffff',
                  textShadow: '0 4px 20px rgba(0,0,0,0.7)'
                }}
              >
                أناقتكِ تبدأ <br />
                <span className="text-gold-gradient">من هنا</span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '1.75rem',
                  textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                }}
              >
                اكتشفي أحدث صيحات الموضة النسائية وتصاميم الهوت كوتور المبتكرة مع Momen Center.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => navigateTo('shop')} className="btn-primary">
                  <ShoppingBag size={18} />
                  <span>تسوقي الآن</span>
                </button>
                <button onClick={onScrollToNext} className="btn-secondary">
                  <span>اكتشفي المجموعة</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </div>

            {/* PHASE 2: Fabric & Craftsmanship Unfurls (25% - 58%) */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                maxWidth: '520px',
                textAlign: 'right',
                opacity: activePhase === 2 ? 1 : 0,
                transform: activePhase === 2 ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: activePhase === 2 ? 'auto' : 'none'
              }}
            >
              <div className="badge-sage" style={{ marginBottom: '0.85rem' }}>
                <span>خامات إيطالية نقية 100%</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}
              >
                انسيابية الحرير <br />
                <span className="text-gold-gradient">ودقة التفاصيل</span>
              </h2>
              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}
              >
                كل غرزة نُسجت بحرفية بالغة لتمنحكِ الراحة والشعور بالفخامة في كل إطلالة ومناسبة.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: 'rgba(7, 27, 19, 0.75)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--gold-200)'
                  }}
                >
                  ✓ حرير ساتان ناعم مضاد للتجعد
                </div>
                <div
                  style={{
                    background: 'rgba(7, 27, 19, 0.75)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.6rem 1rem',
                    fontSize: '0.85rem',
                    color: 'var(--gold-200)'
                  }}
                >
                  ✓ حياكة يدوية مخصصة
                </div>
              </div>
            </div>

            {/* PHASE 3: 360° Rotating Dress Spotlight (58% - 85%) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                maxWidth: '460px',
                textAlign: 'left',
                direction: 'ltr',
                opacity: activePhase === 3 ? 1 : 0,
                transform: activePhase === 3 ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: activePhase === 3 ? 'auto' : 'none'
              }}
            >
              <div
                style={{
                  background: 'rgba(11, 35, 25, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid var(--gold-500)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(212, 175, 55, 0.25)',
                  direction: 'rtl',
                  textAlign: 'right'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge-gold">القطعة الأيقونية</span>
                  <span className="font-editorial" style={{ color: 'var(--gold-400)', fontWeight: 700, fontSize: '1.25rem' }}>
                    3,850 ج.م
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                  {signatureDress.name}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  ماكسي حريري بلون المريمية الزيتوني مع حزام خصر رقيق وأكمام منسدلة. تصميم حصري متوفر بكميات محدودة.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => openQuickView(signatureDress)}
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.7rem 1rem', fontSize: '0.88rem' }}
                  >
                    <span>نظرة سريعة وحجز</span>
                  </button>
                  <button
                    onClick={() => navigateTo('product', signatureDress.id)}
                    className="btn-secondary"
                    style={{ padding: '0.7rem 1rem', fontSize: '0.88rem' }}
                  >
                    <span>التفاصيل</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PHASE 4: Full Reveal & Transition Call To Action (85% - 100%) */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                left: 0,
                margin: '0 auto',
                maxWidth: '680px',
                textAlign: 'center',
                opacity: activePhase === 4 ? 1 : 0,
                transform: activePhase === 4 ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: activePhase === 4 ? 'auto' : 'none'
              }}
            >
              <div className="badge-gold" style={{ marginBottom: '1rem' }}>
                <Sparkles size={14} />
                <span>اكتملت القصة — مرحباً بكِ في عالم مؤمن سنتر</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  color: '#ffffff',
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                }}
              >
                تسوّقي التشكيلة الملكية <br />
                <span className="text-gold-gradient">واستمتعي بالشحن المجاني</span>
              </h2>

              <p
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.75rem',
                  lineHeight: 1.6
                }}
              >
                شحن مجاني لكافة محافظات مصر للطلبات التي تتجاوز 2,500 ج.م مع خيار الدفع عند الاستلام.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigateTo('shop')}
                  className="btn-primary"
                  style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}
                >
                  <ShoppingBag size={20} />
                  <span>تصفحي المتجر الكامل</span>
                </button>
                <button
                  onClick={onScrollToNext}
                  className="btn-secondary"
                  style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
                >
                  <span>استكشفي الأقسام</span>
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Scroll Indicator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              opacity: activePhase < 4 ? 0.9 : 0.3,
              transition: 'opacity 0.4s ease'
            }}
          >
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--gold-300)',
                letterSpacing: '0.08em',
                fontWeight: 500
              }}
            >
              مرري للأسفل لاكتشاف القصة
            </span>
            <div
              style={{
                width: '26px',
                height: '42px',
                borderRadius: '13px',
                border: '1.5px solid var(--gold-500)',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '6px'
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '8px',
                  borderRadius: '2px',
                  background: 'var(--gold-400)',
                  animation: 'floatSlow 1.5s infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
