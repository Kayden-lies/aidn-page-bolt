import { useState, useRef } from 'react';
import { PARTNERS } from '@/data/content';

export function Partners() {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicate the partners array for seamless loop
  const marqueeItems = [...PARTNERS, ...PARTNERS];

  return (
    <section
      id="partners"
      className="relative bg-[#05070a] py-20 sm:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 mb-10">
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/30">
          Partners & Collaborators
        </h2>
      </div>

      {/* Marquee band — only top and bottom borders visible */}
      <div
        ref={containerRef}
        className="relative overflow-hidden border-t border-b border-white/[0.08]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex items-center gap-16 sm:gap-24 py-8 sm:py-10 whitespace-nowrap"
          style={{
            animation: 'marquee-scroll 40s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {marqueeItems.map((partner, i) => (
            <span
              key={`${partner}-${i}`}
              className="text-lg sm:text-xl md:text-2xl font-display tracking-wide text-white/40 hover:text-white/70 transition-colors duration-300"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
