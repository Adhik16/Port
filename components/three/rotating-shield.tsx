"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";


/** Build a procedural shield shape using ShapeGeometry + ExtrudeGeometry */
function createShieldShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Shield path — classic heraldic shield silhouette
  const w = 1.2; // half-width
  const h = 1.6; // half-height

  shape.moveTo(0, h); // top center
  shape.lineTo(-w * 0.7, h); // top left
  shape.lineTo(-w * 0.9, h * 0.65); // upper left curve start

  // Left curve (approximated with quadratic curves)
  shape.quadraticCurveTo(-w, h * 0.3, -w, 0);
  shape.quadraticCurveTo(-w, -h * 0.2, -w * 0.7, -h * 0.5);
  shape.quadraticCurveTo(-w * 0.3, -h, 0, -h);

  // Right side (mirror)
  shape.quadraticCurveTo(w * 0.3, -h, w * 0.7, -h * 0.5);
  shape.quadraticCurveTo(w, -h * 0.2, w, 0);
  shape.quadraticCurveTo(w, h * 0.3, w * 0.9, h * 0.65);
  shape.lineTo(w * 0.7, h);

  shape.closePath();
  return shape;
}

/** Lock icon shape in the center of the shield */
function LockIcon() {
  return (
    <group position={[0, 0.15, 0.15]}>
      {/* Lock body */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.2]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {/* Lock shackle */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.2, 0.06, 8, 16, Math.PI]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Rotating shield mesh */
function ShieldMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const shape = useMemo(() => createShieldShape(), []);

  const extrudeSettings = useMemo(
    () => ({
      steps: 2,
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 4,
    }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main shield */}
      <mesh>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color="#18181b"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Shield edge glow — slightly larger transparent outline */}
      <mesh scale={[1.03, 1.03, 0.8]}>
        <extrudeGeometry
          args={[shape, { ...extrudeSettings, depth: 0.1, bevelThickness: 0.02, bevelSize: 0.02 }]}
        />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7c3aed"
          emissiveIntensity={0.5}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lock icon */}
      <LockIcon />
    </group>
  );
}

/** Floating particle field for depth */
function Particles({ count = 200 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#a855f7"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/** Glow ring around the shield */
function GlowRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.15;
      ref.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.015, 16, 100]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#7c3aed"
        emissiveIntensity={0.8}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function RotatingShield() {
  return (
    <div
      className="w-full h-full min-h-[400px] md:min-h-[500px]"
      aria-label="3D rotating cybersecurity shield"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 2, 3]} intensity={1.5} color="#a855f7" />
        <pointLight position={[-3, -1, -2]} intensity={0.8} color="#7c3aed" />
        <directionalLight position={[0, 0, 5]} intensity={0.6} color="#c084fc" />

        <ShieldMesh />
        <GlowRing />
        <Particles count={150} />
      </Canvas>
    </div>
  );
}
