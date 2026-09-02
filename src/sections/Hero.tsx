import { useRef, useState, useEffect, useCallback } from 'react';
import { HeroCanvas } from '@/three/HeroScene';
import { INTRO_LINES } from '@/data/content';

export function Hero({ onRevealComplete }: { onRevealComplete?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const revealProgressRef = useRef(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [introLine] = useState(() => INTRO_LINES[Math.floor(Math.random() * INTRO_LINES.length)]);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let elapsed = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      elapsed += dt;

      // Auto-reveal over ~4 seconds, then becomes interactive
      const duration = 4;
      const progress = Math.min(elapsed / duration, 1);
      revealProgressRef.current = progress;
      setRevealProgress(progress);

      if (progress >= 1 && !interactive) {
        setInteractive(true);
        setTextVisible(true);
        onRevealComplete?.();
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [interactive, onRevealComplete]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const scrollToNext = useCallback(() => {
    const el = document.getElementById('what-we-do');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const textOpacity = Math.max(0, (revealProgress - 0.6) / 0.4);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #05070a 0%, #080b12 100%)' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <HeroCanvas
          mouseRef={mouseRef}
          revealProgress={revealProgressRef}
          interactive={interactive}
        />
      </div>

      {/* Intro line — top, subtle */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 px-6 text-center"
        style={{ opacity: revealProgress < 0.3 ? Math.min(1, revealProgress / 0.3) : Math.max(0, 1 - (revealProgress - 0.5) / 0.2) }}
      >
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/40">
          {introLine}
        </p>
      </div>

      {/* Identity reveal text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <div className="text-center px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display tracking-tight text-white/90">
            Artificial Intelligence
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display tracking-tight text-white/90 mt-1">
            Developer Network
          </h1>
          <div className="mt-6 sm:mt-8">
            <p className="text-base sm:text-lg md:text-xl font-display tracking-[0.15em] text-[#c8a45c]">
              From Code to Cognition
            </p>
          </div>
          <div className="mt-3">
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/40">
              Built in Pune for developers.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {textVisible && (
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto group"
          aria-label="Scroll to explore"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors">
              Scroll
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent group-hover:from-[#c8a45c]/40 transition-colors" />
          </div>
        </button>
      )}
    </section>
  );
}
