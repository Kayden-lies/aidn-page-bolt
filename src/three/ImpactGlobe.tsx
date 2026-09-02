import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Approximate lat/lng coordinates for globe points
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

interface GlobePointsProps {
  scrollProgress: React.MutableRefObject<number>;
  accentColor: THREE.Color;
}

function GlobePoints({ scrollProgress, accentColor }: GlobePointsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { positions, colors, puneIndex } = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = 2.5;
    let puneIdx = -1;

    for (let i = 0; i < count; i++) {
      // Distribute points on sphere surface using fibonacci spiral
      const t = i / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = 2 * Math.PI * i / 1.618033988749;

      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.cos(inclination);
      const z = radius * Math.sin(inclination) * Math.sin(azimuth);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Default: white points
      colors[i * 3] = 0.9;
      colors[i * 3 + 1] = 0.9;
      colors[i * 3 + 2] = 0.9;

      // Check if near Pune (lat ~18.52, lng ~73.85)
      const lat = 90 - inclination * 180 / Math.PI;
      const lng = azimuth * 180 / Math.PI - 180;
      const dLat = Math.abs(lat - 18.52);
      const dLng = Math.abs(lng - 73.85);
      if (dLat < 2 && dLng < 2) {
        if (puneIdx === -1 || Math.random() > 0.5) {
          puneIdx = i;
        }
        // Pune points get accent color
        colors[i * 3] = accentColor.r;
        colors[i * 3 + 1] = accentColor.g;
        colors[i * 3 + 2] = accentColor.b;
      }
    }

    return { positions, colors, puneIndex: puneIdx };
  }, [accentColor]);

  useFrame((state) => {
    if (!groupRef.current || !pointsRef.current) return;

    const sp = scrollProgress.current;

    // First 20%: gentle auto-rotation only
    if (sp < 0.2) {
      groupRef.current.rotation.y += 0.001;
      return;
    }

    // After 20%: scroll-controlled camera journey
    const journey = (sp - 0.2) / 0.8; // 0 to 1

    // Phase 1 (0-0.3): Rotate around globe
    // Phase 2 (0.3-0.6): Move closer to India
    // Phase 3 (0.6-1.0): Dive into Pune
    const camera = state.camera;

    if (journey < 0.3) {
      const t = journey / 0.3;
      groupRef.current.rotation.y = t * Math.PI * 0.5;
      camera.position.set(0, 0, 6 - t * 1.5);
    } else if (journey < 0.6) {
      const t = (journey - 0.3) / 0.3;
      groupRef.current.rotation.y = Math.PI * 0.5 + t * Math.PI * 0.3;
      camera.position.set(
        (1 - t) * 0 + t * 1.5,
        (1 - t) * 0 + t * 0.5,
        4.5 - t * 2
      );
    } else {
      const t = (journey - 0.6) / 0.4;
      groupRef.current.rotation.y = Math.PI * 0.8 + t * 0.2;

      // Pune location on globe
      const punePos = latLngToVec3(18.52, 73.85, 2.5);

      camera.position.set(
        1.5 + t * (punePos.x * 0.9 - 1.5),
        0.5 + t * (punePos.y * 0.9 - 0.5),
        2.5 - t * 2.2
      );
    }

    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

interface ImpactGlobeProps {
  scrollProgress: React.MutableRefObject<number>;
}

export function ImpactGlobeCanvas({ scrollProgress }: ImpactGlobeProps) {
  const accentColor = useMemo(() => new THREE.Color('#c8a45c'), []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <GlobePoints scrollProgress={scrollProgress} accentColor={accentColor} />
    </Canvas>
  );
}
