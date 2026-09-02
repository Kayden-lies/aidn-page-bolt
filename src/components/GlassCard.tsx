import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  distortion?: number;
  turbulence?: number;
  id?: string;
}

export function GlassCard({
  children,
  className = '',
  distortion = 8,
  turbulence = 0.02,
  id,
}: GlassCardProps) {
  const filterId = id ?? `glass-${Math.random().toString(36).slice(2, 9)}`;
  const turbulenceId = `${filterId}-turbulence`;
  const displacementId = `${filterId}-displacement`;

  return (
    <div className={`relative ${className}`} style={{ filter: `url(#${filterId})` }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              id={turbulenceId}
              type="fractalNoise"
              baseFrequency={turbulence}
              numOctaves={2}
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              id={displacementId}
              in="SourceGraphic"
              in2="noise"
              scale={distortion}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="relative backdrop-blur-sm bg-white/[0.04] border border-white/10 rounded-lg">
        {children}
      </div>
    </div>
  );
}
