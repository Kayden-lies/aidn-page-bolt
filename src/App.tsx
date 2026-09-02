import { useState, useEffect } from 'react';
import { Hero } from '@/sections/Hero';
import { Navigation } from '@/sections/Navigation';
import { WhatWeDo } from '@/sections/WhatWeDo';
import { Impact } from '@/sections/Impact';
import { SignatureEvents } from '@/sections/SignatureEvents';
import { Partners } from '@/sections/Partners';
import { CampusConnect } from '@/sections/CampusConnect';
import { GetInvolved } from '@/sections/GetInvolved';
import { Footer } from '@/sections/Footer';
import { NAV_SECTIONS } from '@/data/content';

function App() {
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Detect current section
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top + scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollY + vh * 0.4 >= sectionTop && scrollY + vh * 0.4 < sectionBottom) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative bg-[#05070a]">
      <Navigation visible={heroRevealed} activeSection={activeSection} />

      <Hero onRevealComplete={() => setHeroRevealed(true)} />

      <main>
        <WhatWeDo />
        <Impact />
        <SignatureEvents />
        <Partners />
        <CampusConnect />
        <GetInvolved />
      </main>

      <Footer />
    </div>
  );
}

export default App;
