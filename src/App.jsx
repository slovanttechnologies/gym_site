import { useEffect, useRef } from 'react';
import cleanPortrait from './assets/clean-portrait.jpg';
import powerPortrait from './assets/power-portrait.jpg';

export default function App() {
  const heroRef = useRef(null);
  const revealRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const isFirstMoveRef = useRef(true);
  const rafIdRef = useRef(null);
  const isDesktopRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateDesktopStatus = () => {
      isDesktopRef.current = mediaQuery.matches;
    };
    updateDesktopStatus();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateDesktopStatus);
    } else {
      mediaQuery.addListener(updateDesktopStatus);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateDesktopStatus);
      } else {
        mediaQuery.removeListener(updateDesktopStatus);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const updateCursor = () => {
    if (!revealRef.current) {
      rafIdRef.current = null;
      return;
    }

    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;
    const delta = Math.hypot(dx, dy);

    if (delta < 0.3) {
      currentRef.current.x = targetRef.current.x;
      currentRef.current.y = targetRef.current.y;
      const maskX = Math.round(currentRef.current.x - 55);
      const maskY = Math.round(currentRef.current.y - 70);
      revealRef.current.style.maskPosition = `${maskX}px ${maskY}px`;
      revealRef.current.style.webkitMaskPosition = `${maskX}px ${maskY}px`;
      rafIdRef.current = null;
      return;
    }

    currentRef.current.x += dx * 0.22;
    currentRef.current.y += dy * 0.22;
    const maskX = Math.round(currentRef.current.x - 55);
    const maskY = Math.round(currentRef.current.y - 70);
    revealRef.current.style.maskPosition = `${maskX}px ${maskY}px`;
    revealRef.current.style.webkitMaskPosition = `${maskX}px ${maskY}px`;

    rafIdRef.current = requestAnimationFrame(updateCursor);
  };

  const handleMouseMove = (e) => {
    if (!isDesktopRef.current || !heroRef.current || !revealRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetRef.current.x = x;
    targetRef.current.y = y;

    if (isFirstMoveRef.current) {
      currentRef.current.x = x;
      currentRef.current.y = y;
      const maskX = Math.round(x - 55);
      const maskY = Math.round(y - 70);
      revealRef.current.style.maskPosition = `${maskX}px ${maskY}px`;
      revealRef.current.style.webkitMaskPosition = `${maskX}px ${maskY}px`;
      revealRef.current.style.opacity = '1';
      isFirstMoveRef.current = false;
      return;
    }

    revealRef.current.style.opacity = '1';

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(updateCursor);
    }
  };

  const handleMouseLeave = () => {
    if (!isDesktopRef.current || !revealRef.current) return;
    revealRef.current.style.opacity = '0';
    isFirstMoveRef.current = true;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  return (
    <section
      ref={heroRef}
      className="hero-section"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Clean portrait */}
      <img
        src={cleanPortrait}
        alt="clean portrait"
        className="hero-layer clean-layer"
        draggable={false}
      />

      {/* 2. Power layer at 10% */}
      <img
        src={powerPortrait}
        alt="power portrait base"
        className="hero-layer power-base-layer"
        draggable={false}
      />

      {/* 3. Power reveal layer */}
      <img
        ref={revealRef}
        src={powerPortrait}
        alt="power portrait reveal"
        className="hero-layer power-reveal-layer"
        draggable={false}
      />

      {/* 4. Scrim */}
      <div className="hero-layer scrim-layer" />

      {/* Content overlay */}
      <div className="hero-content">
        {/* Top bar */}
        <header className="top-bar">
          <div className="top-left">
            <span className="gym-brand">ironwork®</span>
            <span className="archive-label">training archive</span>
          </div>

          <div className="top-center-pill">
            <span>©2026</span>
          </div>

          <div className="top-right">
            <span>(</span>
            <span>strength</span>
            <span>/</span>
            <span>conditioning</span>
            <span>)</span>
          </div>
        </header>

        {/* Headline */}
        <h1 className="hero-headline">
          <span className="headline-line">built in iron</span>
          <span className="headline-line headline-row">
            <span className="circle-plus-glyph" aria-hidden="true">
              <span>+</span>
            </span>
            <span>discipline</span>
          </span>
        </h1>

        {/* Bottom row */}
        <footer className="bottom-row">
          <div className="bottom-left-hours">
            open 5am — midnight
          </div>

          <div className="bottom-right-block">
            <p className="bottom-paragraph">
              heavy weights, honest work. we coach strength and conditioning for people who show up early and leave tired — where effort becomes the routine and progress does the talking. no shortcuts, no gimmicks: just consistent training, done properly.
            </p>
            <div className="bottom-meta-row">
              <span>memberships — plan 01</span>
              <span>( scroll ↓ )</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
