import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface AIDNModelProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  revealProgress: React.MutableRefObject<number>;
  interactive: boolean;
}

function AIDNModel({ mouseRef, revealProgress, interactive }: AIDNModelProps) {
  const gltf = useLoader(GLTFLoader, '/models/AIDN_Logo_3D_Model.glb');
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = gltf;

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const rp = revealProgress.current;

    // Opacity / visibility based on reveal progress
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.Material & { opacity: number; transparent: boolean };
        if (mat) {
          mat.transparent = true;
          // Start invisible, fade in from 0.05 to 0.35, then full at 0.6+
          if (rp < 0.05) {
            mat.opacity = 0;
          } else if (rp < 0.35) {
            mat.opacity = (rp - 0.05) / 0.3 * 0.3;
          } else if (rp < 0.6) {
            mat.opacity = 0.3 + (rp - 0.35) / 0.25 * 0.7;
          } else {
            mat.opacity = 1;
          }
        }
      }
    });

    // Initial rotation - subtle during reveal, interactive after
    if (interactive && rp > 0.7) {
      const targetX = mouseRef.current.y * 0.3;
      const targetY = mouseRef.current.x * 0.5;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
    } else {
      // Slow auto-rotation during reveal
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} ref={meshRef} />
    </group>
  );
}

interface SpotlightProps {
  revealProgress: React.MutableRefObject<number>;
}

function TravelingSpotlight({ revealProgress }: SpotlightProps) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (!lightRef.current || !targetRef.current) return;

    const rp = revealProgress.current;

    // Light travels from far right to center during 0.3-0.55 of reveal
    if (rp < 0.3) {
      lightRef.current.intensity = 0;
    } else if (rp < 0.55) {
      const t = (rp - 0.3) / 0.25;
      lightRef.current.position.x = 8 - t * 8;
      lightRef.current.position.z = 5 - t * 5;
      lightRef.current.intensity = t * 30;
    } else {
      // Lock in place
      lightRef.current.position.set(2, 3, 2);
      lightRef.current.intensity = 30;
    }

    // Ensure target is set
    lightRef.current.target = targetRef.current;
    targetRef.current.updateMatrixWorld();
  });

  return (
    <>
      <spotLight
        ref={lightRef}
        position={[8, 3, 5]}
        angle={0.5}
        penumbra={0.6}
        intensity={0}
        color="#e0bd75"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <object3D ref={targetRef} position={[0, 0, 0]} />
    </>
  );
}

function AmbientCinemaLight() {
  const lightRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    // Low ambient that simulates reflected gala lighting
    lightRef.current.intensity = 0.15;
  });

  return <ambientLight ref={lightRef} intensity={0.15} color="#1a1a2e" />;
}

function FillLight() {
  return (
    <>
      <directionalLight position={[-5, 2, 3]} intensity={0.2} color="#2a2a3e" />
      <pointLight position={[0, -3, 2]} intensity={0.1} color="#1a1a2e" />
    </>
  );
}

interface HeroSceneProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  revealProgress: React.MutableRefObject<number>;
  interactive: boolean;
}

function HeroScene({ mouseRef, revealProgress, interactive }: HeroSceneProps) {
  return (
    <>
      <AmbientCinemaLight />
      <FillLight />
      <TravelingSpotlight revealProgress={revealProgress} />
      <Suspense fallback={null}>
        <AIDNModel mouseRef={mouseRef} revealProgress={revealProgress} interactive={interactive} />
      </Suspense>
      <Environment preset="night" environmentIntensity={0.1} />
    </>
  );
}

export function HeroCanvas({ mouseRef, revealProgress, interactive }: HeroSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <HeroScene mouseRef={mouseRef} revealProgress={revealProgress} interactive={interactive} />
    </Canvas>
  );
}
