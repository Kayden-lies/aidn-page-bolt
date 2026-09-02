import { useState, useEffect } from 'react';
import { NAV_SECTIONS } from '@/data/content';

interface NavigationProps {
  visible: boolean;
  activeSection: string;
}

export function Navigation({ visible, activeSection }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeLabel = NAV_SECTIONS.find((s) => s.id === activeSection)?.label ?? '';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className={`transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
        <div className="flex justify-center">
          <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
            {NAV_SECTIONS.slice(1).map((section) => {
              const isActive = section.id === activeSection;
              const isPast = NAV_SECTIONS.findIndex((s) => s.id === activeSection) >
                NAV_SECTIONS.findIndex((s) => s.id === section.id);

              return (
                <button
                  key={section.id}
                  onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative px-3 sm:px-4 py-1 text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300"
                  style={{
                    color: isActive ? 'rgba(255,255,255,0.9)' : isPast ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {section.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c8a45c]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
