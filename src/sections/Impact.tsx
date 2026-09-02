import { useRef } from 'react';
import { ImpactGlobeCanvas } from '@/three/ImpactGlobe';
import { GlassCard } from '@/components/GlassCard';
import { METRICS } from '@/data/content';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export function Impact() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);
  const progressRef = useRef(0);
  progressRef.current = progress;

  return (
    <section
      ref={sectionRef}
      id="impact"
      className="relative bg-[#05070a]"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Point-cloud globe — right side */}
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="w-full md:w-[60%] h-full">
            <ImpactGlobeCanvas scrollProgress={progressRef} />
          </div>
        </div>

        {/* Metrics — left side */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
            <div className="w-full md:w-[45%] space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/30">
                Impact / The Network
              </p>

              {/* Main glass card with nested cards */}
              <GlassCard distortion={6} turbulence={0.015} id="impact-main">
                <div className="p-6 sm:p-8">
                  <p className="text-4xl sm:text-5xl md:text-6xl font-display tracking-tight text-white">
                    {METRICS.members}
                  </p>
                  <p className="text-xs sm:text-sm uppercase tracking-widest text-white/50 mt-2">
                    {METRICS.membersLabel}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <GlassCard distortion={4} turbulence={0.02} id="impact-commudle">
                      <div className="p-4">
                        <p className="text-2xl sm:text-3xl font-display text-[#c8a45c]">
                          {METRICS.commudle}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                          {METRICS.commudleLabel}
                        </p>
                      </div>
                    </GlassCard>
                    <GlassCard distortion={4} turbulence={0.02} id="impact-meetup">
                      <div className="p-4">
                        <p className="text-2xl sm:text-3xl font-display text-white/80">
                          {METRICS.meetup}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                          {METRICS.meetupLabel}
                        </p>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </GlassCard>

              {/* Secondary metric cards */}
              <div className="grid grid-cols-3 gap-3">
                <GlassCard distortion={5} turbulence={0.018} id="impact-events">
                  <div className="p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-display text-white">{METRICS.events}</p>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">
                      {METRICS.eventsLabel}
                    </p>
                  </div>
                </GlassCard>
                <GlassCard distortion={5} turbulence={0.018} id="impact-campus">
                  <div className="p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-display text-white">{METRICS.campusPartnerships}</p>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1 leading-tight">
                      {METRICS.campusPartnershipsLabel}
                    </p>
                  </div>
                </GlassCard>
                <GlassCard distortion={5} turbulence={0.018} id="impact-cities">
                  <div className="p-4 text-center">
                    <p className="text-2xl sm:text-3xl font-display text-white">{METRICS.cities}</p>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1 leading-tight">
                      {METRICS.citiesLabel}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
