import { useState, useRef, useEffect } from 'react';
import { EVENTS } from '@/data/content';

export function SignatureEvents() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expanding, setExpanding] = useState(false);

  const handleCardClick = (index: number) => {
    setExpanding(true);
    setExpandedIndex(index);
  };

  // After expansion animation, navigate to placeholder route
  useEffect(() => {
    if (expandedIndex !== null && expanding) {
      const timer = setTimeout(() => {
        const event = EVENTS[expandedIndex];
        // Placeholder destination — real routes like /hop will replace this
        window.location.hash = `#${event.route}`;
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [expandedIndex, expanding]);

  return (
    <section
      id="events"
      className="relative bg-[#05070a] py-24 sm:py-32 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        {/* Section title */}
        <h2 className="text-xs uppercase tracking-[0.3em] text-white/30 mb-12">
          Signature Events
        </h2>

        {/* Current Ongoing Series */}
        <div className="mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8a45c]/60 mb-3">
            Current Ongoing Series
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-display tracking-tight text-white/80">
            From Code to Cognition
          </p>
        </div>

        {/* Past Initiatives */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">
            Past Initiatives
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {EVENTS.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                isExpanded={expandedIndex === index}
                isExpanding={expanding && expandedIndex === index}
                isDimmed={expandedIndex !== null && expandedIndex !== index}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full-viewport expansion overlay */}
      {expandedIndex !== null && (
        <ExpandedOverlay event={EVENTS[expandedIndex]} />
      )}
    </section>
  );
}

function EventCard({
  event,
  isExpanded,
  isExpanding,
  isDimmed,
  onClick,
}: {
  event: typeof EVENTS[0];
  isExpanded: boolean;
  isExpanding: boolean;
  isDimmed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg text-left"
      style={{
        aspectRatio: '3 / 4',
        transform: isExpanding ? 'scale(1.08)' : 'scale(1)',
        opacity: isDimmed ? 0.2 : 1,
        zIndex: isExpanding ? 30 : 1,
        transition: 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease',
        pointerEvents: isExpanded ? 'none' : 'auto',
      }}
    >
      {/* Photo background */}
      <div
        className="absolute inset-0 bg-[#0a0e14]"
        style={{
          backgroundImage: `url(${event.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isExpanding ? 0.25 : 0.08,
          transition: 'opacity 0.7s ease',
        }}
      />
      {/* Deep black overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: isExpanding ? 0.65 : 0.88,
          transition: 'opacity 0.7s ease',
        }}
      />
      {/* Title */}
      <div className="absolute inset-0 flex items-end p-5 sm:p-6">
        <div>
          <h3 className="text-base sm:text-lg font-display tracking-tight text-white/90 leading-snug">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="text-xs text-[#c8a45c]/70 mt-1.5 tracking-wide">
              {event.subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Hover hint */}
      <div
        className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 8L8 2M8 2H3M8 2V7" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      </div>
    </button>
  );
}

function ExpandedOverlay({ event }: { event: typeof EVENTS[0] }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        background: `linear-gradient(180deg, rgba(5,7,10,0.95) 0%, rgba(10,14,20,0.98) 100%)`,
        animation: 'fade-in-up 0.6s ease forwards',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${event.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
        }}
      />
      <div className="relative text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8a45c]/60 mb-4">
          Event page coming soon
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight text-white">
          {event.title}
        </h2>
        {event.subtitle && (
          <p className="text-base text-[#c8a45c] mt-3 tracking-wide">
            {event.subtitle}
          </p>
        )}
        <p className="text-xs text-white/30 mt-6">
          Route: {event.route}
        </p>
      </div>
    </div>
  );
}
