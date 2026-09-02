import { useRef, useState, useEffect } from 'react';
import { ACTIVITIES } from '@/data/content';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);

  // Determine active card index from scroll progress
  const segmentSize = 1 / ACTIVITIES.length;
  const activeIndex = Math.min(
    ACTIVITIES.length - 1,
    Math.floor(progress / segmentSize)
  );

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative bg-[#05070a]"
      style={{ height: `${ACTIVITIES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left: Stacked photo cards */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center">
              <CardStack activities={ACTIVITIES} activeIndex={activeIndex} progress={progress} />
            </div>

            {/* Right: Typography */}
            <div className="relative h-[50vh] md:h-[70vh] flex items-center">
              <div className="w-full">
                <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-6">
                  What We Do at AIDN
                </p>
                {ACTIVITIES.map((activity, i) => (
                  <ActivityText
                    key={activity.number}
                    activity={activity}
                    index={i}
                    activeIndex={activeIndex}
                    progress={progress}
                    segmentSize={segmentSize}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardStack({
  activities,
  activeIndex,
  progress,
}: {
  activities: typeof ACTIVITIES;
  activeIndex: number;
  progress: number;
}) {
  const segmentSize = 1 / activities.length;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {activities.map((activity, i) => {
        // Calculate position within the stack
        const segmentStart = i * segmentSize;
        const segmentProgress = (progress - segmentStart) / segmentSize;

        // Active card is shifted right; cards behind are left-anchored
        const distance = i - activeIndex;
        const isActive = i === activeIndex;
        const isBehind = i < activeIndex;
        const isAhead = i > activeIndex;

        // Y offset: active is centered, behind cards stack upward, ahead cards below
        const yOffset = isBehind ? -(distance * 30) : isAhead ? (distance * 30) : 0;
        // X shift: active card shifts right
        const xShift = isActive ? 40 : isBehind ? 0 : 0;
        // Scale: active is full, behind are slightly smaller
        const scale = isActive ? 1 : isBehind ? 1 - Math.abs(distance) * 0.05 : 0.9;
        // Opacity
        const opacity = isActive ? 1 : isBehind ? Math.max(0.15, 1 - Math.abs(distance) * 0.3) : 0;
        // Z-index
        const zIndex = isActive ? 10 : isBehind ? activities.length - Math.abs(distance) : 0;
        // Spotlight intensity for active
        const brightness = isActive ? 1 : isBehind ? 0.3 + (1 - Math.abs(distance) * 0.2) * 0.3 : 0.3;

        return (
          <div
            key={activity.number}
            className="absolute"
            style={{
              transform: `translate(${xShift}px, ${yOffset}px) scale(${scale})`,
              opacity,
              zIndex,
              filter: `brightness(${brightness})`,
              transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease, filter 0.4s ease',
            }}
          >
            <div
              className="relative w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] rounded-lg overflow-hidden shadow-2xl"
              style={{
                boxShadow: isActive
                  ? '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(200,164,92,0.08)'
                  : '0 20px 40px -15px rgba(0,0,0,0.6)',
              }}
            >
              {/* Photo placeholder — structured for real AIDN photos */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0f141c] to-[#05070a]"
                style={{
                  backgroundImage: `url(${activity.photo}), linear-gradient(135deg, #0f141c, #05070a)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60" />
              {/* Spotlight overlay on active */}
              {isActive && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at 50% 40%, rgba(200,164,92,0.08) 0%, transparent 60%)',
                  }}
                />
              )}
              {/* Card label */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[10px] tracking-[0.3em] text-[#c8a45c]/80 mb-1">
                  {activity.number}
                </p>
                <p className="text-sm tracking-wide text-white/70">
                  {activity.title}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityText({
  activity,
  index,
  activeIndex,
  progress,
  segmentSize,
}: {
  activity: typeof ACTIVITIES[0];
  index: number;
  activeIndex: number;
  progress: number;
  segmentSize: number;
}) {
  const segmentStart = index * segmentSize;
  const localProgress = Math.max(0, Math.min(1, (progress - segmentStart) / segmentSize));

  const isActive = index === activeIndex;
  const isPast = index < activeIndex;

  // Text moves up and fades when not active
  const yOffset = isPast ? -30 : isActive ? 0 : 30;
  const opacity = isActive ? 1 : 0;

  return (
    <div
      className="absolute top-0 left-0 right-0"
      style={{
        transform: `translateY(${yOffset}px)`,
        opacity,
        transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease',
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-xs tracking-[0.3em] text-[#c8a45c]">
          {activity.number}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight text-white mb-4">
        {activity.title}
      </h2>
      <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-md">
        {activity.description}
      </p>
    </div>
  );
}
