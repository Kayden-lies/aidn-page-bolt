import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DoorPanel({
  side,
  openAmount,
}: {
  side: 'left' | 'right';
  openAmount: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const open = openAmount.current;
    const dir = side === 'left' ? -1 : 1;

    // Rotate door panel open
    ref.current.rotation.y = dir * open * (Math.PI / 2.5);

    // Shift slightly outward when opening
    ref.current.position.x = dir * (1.1 + open * 0.3);
  });

  const dir = side === 'left' ? -1 : 1;

  return (
    <group ref={ref} position={[side === 'left' ? -1.1 : 1.1, 0, 0]}>
      {/* Door panel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 4, 0.08]} />
        <meshStandardMaterial
          color="#1a1f28"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Door frame edge */}
      <mesh position={[dir * -0.55, 0, 0.04]}>
        <boxGeometry args={[0.03, 4, 0.1]} />
        <meshStandardMaterial
          color="#c8a45c"
          metalness={0.8}
          roughness={0.2}
          emissive="#c8a45c"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function DoorFrame() {
  return (
    <group>
      {/* Top frame */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[2.5, 0.12, 0.12]} />
        <meshStandardMaterial color="#151a22" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Side frames */}
      <mesh position={[-1.3, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 4.2, 0.12]} />
        <meshStandardMaterial color="#151a22" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.3, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 4.2, 0.12]} />
        <meshStandardMaterial color="#151a22" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Handshake({ visible }: { visible: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const v = visible.current;
    groupRef.current.children.forEach((child) => {
      child.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          const mat = node.material as THREE.Material & { opacity: number; transparent: boolean };
          if (mat) {
            mat.transparent = true;
            mat.opacity = Math.max(0, (v - 0.4) / 0.6);
          }
        }
      });
    });
  });

  // Stylized handshake using simple geometry
  return (
    <group ref={groupRef} position={[0, 0, -0.3]}>
      {/* Left hand/forearm */}
      <group position={[-0.4, 0, 0]} rotation={[0, 0, -0.1]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
          <meshStandardMaterial color="#c8a45c" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.15]} />
          <meshStandardMaterial color="#c8a45c" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Right hand/forearm */}
      <group position={[0.4, 0, 0]} rotation={[0, 0, 0.1]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.12, 0.6, 8, 16]} />
          <meshStandardMaterial color="#e0bd75" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.15]} />
          <meshStandardMaterial color="#e0bd75" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Clasp center */}
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.22, 0.2]} />
        <meshStandardMaterial color="#d4b06a" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

function DoorScene({ openAmount }: { openAmount: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.5}
        penumbra={0.5}
        intensity={15}
        color="#e0bd75"
        castShadow
      />
      <directionalLight position={[-3, 2, 2]} intensity={0.3} color="#3a3a4e" />

      <DoorFrame />
      <DoorPanel side="left" openAmount={openAmount} />
      <DoorPanel side="right" openAmount={openAmount} />
      <Handshake visible={openAmount} />
    </>
  );
}

interface CampusDoorProps {
  openAmount: React.MutableRefObject<number>;
}

export function CampusDoorCanvas({ openAmount }: CampusDoorProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <DoorScene openAmount={openAmount} />
    </Canvas>
  );
}
