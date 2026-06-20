"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import Satellite from "@/components/three/satellite";
import { coastlineRings } from "@/components/three/coastline-data";

// ── Constants ──────────────────────────────────────────────
const R = 1.35;
const ARC_COUNT = 28;

// ── Helpers ────────────────────────────────────────────────
function llToVec(lat: number, lon: number): THREE.Vector3 {
  const p = THREE.MathUtils.degToRad(90 - lat);
  const t = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(-R*Math.sin(p)*Math.cos(t), R*Math.cos(p), R*Math.sin(p)*Math.sin(t));
}
function cb(t: number, p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3): THREE.Vector3 {
  const u=1-t;
  return new THREE.Vector3(u**3*p0.x+3*u*u*t*p1.x+3*u*t*t*p2.x+t**3*p3.x, u**3*p0.y+3*u*u*t*p1.y+3*u*t*t*p2.y+t**3*p3.y, u**3*p0.z+3*u*u*t*p1.z+3*u*t*t*p2.z+t**3*p3.z);
}
type ArcDef = { s: THREE.Vector3; ma: THREE.Vector3; mb: THREE.Vector3; e: THREE.Vector3 };

// ── Continent Patch Geometry (filled polygon on sphere) ────
function createContinentGeometry(ring: [number, number][], radius: number): THREE.BufferGeometry {
  const pts = ring.map(([lat, lon]) => llToVec(lat, lon));
  // Close ring if not already closed
  if (pts.length > 1) {
    const last = pts[pts.length - 1];
    if (pts[0].distanceTo(last) > 0.003) {
      pts.push(pts[0].clone());
    }
  }
  if (pts.length < 3) {
    // Too few points — return empty geometry
    return new THREE.BufferGeometry();
  }
  // Centroid (average → project onto sphere)
  const centroid = new THREE.Vector3();
  pts.forEach(p => centroid.add(p));
  centroid.divideScalar(pts.length);
  centroid.normalize().multiplyScalar(radius);

  const vertices: number[] = [centroid.x, centroid.y, centroid.z];
  const indices: number[] = [];
  for (const pt of pts) {
    const p = pt.clone().normalize().multiplyScalar(radius);
    vertices.push(p.x, p.y, p.z);
  }
  // Fan triangulation: centroid → each edge
  for (let i = 1; i < pts.length; i++) {
    indices.push(0, i, i + 1);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// ── Coastline points for arc endpoints ─────────────────────
function genArcPts(st: number): THREE.Vector3[] {
  const p: THREE.Vector3[] = [];
  for (const ring of coastlineRings) {
    // Sample the ring at the given step
    for (let i = 0; i < ring.length; i += st) {
      const [lat, lon] = ring[i];
      p.push(llToVec(lat, lon));
    }
  }
  // Fallback: if too few points, add some distributed ones
  if (p.length < 30) {
    for (let lat = -60; lat <= 60; lat += 30)
      for (let lon = -180; lon < 180; lon += 30)
        p.push(llToVec(lat, lon));
  }
  return p;
}

// ── Globe: Ocean ───────────────────────────────────────────
function Ocean() {
  return <mesh><sphereGeometry args={[R-0.01,80,60]} /><meshStandardMaterial color="#080818" emissive="#120826" emissiveIntensity={0.15} metalness={0.35} roughness={0.65} transparent opacity={0.88} /></mesh>;
}
// ── Globe: Coastlines (Natural Earth 110m) ─────────────────
function Coastlines() {
  const lines = useMemo(() => {
    return coastlineRings.map(ring => {
      const pts = ring.map(([lat, lon]) => llToVec(lat, lon));
      // Close the ring
      if (pts.length > 0) pts.push(pts[0].clone());
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      return geo;
    });
  }, []);

  return (
    <group>
      {lines.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial color="#a78bfa" transparent opacity={0.65} depthWrite={false} />
        </lineSegments>
      ))}
    </group>
  );
}

// ── Clickable Continent Patches ────────────────────────────
function ContinentPatches({
  activeIndex,
  hoveredIndex,
  onClick,
  onHover,
  onUnhover,
}: {
  activeIndex: number | null;
  hoveredIndex: number | null;
  onClick: (i: number) => void;
  onHover: (i: number) => void;
  onUnhover: () => void;
}) {
  const geometries = useMemo(
    () => coastlineRings.map(ring => createContinentGeometry(ring, R * 1.012)),
    [],
  );

  return (
    <group>
      {geometries.map((geo, i) => (
        <ContinentPatchMesh
          key={i}
          index={i}
          geometry={geo}
          isActive={activeIndex === i}
          isHovered={hoveredIndex === i}
          onClick={onClick}
          onHover={onHover}
          onUnhover={onUnhover}
        />
      ))}
    </group>
  );
}

function ContinentPatchMesh({
  index,
  geometry,
  isActive,
  isHovered,
  onClick,
  onHover,
  onUnhover,
}: {
  index: number;
  geometry: THREE.BufferGeometry;
  isActive: boolean;
  isHovered: boolean;
  onClick: (i: number) => void;
  onHover: (i: number) => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useCursor(isHovered);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    const targetOpacity = isActive ? 0.3 : isHovered ? 0.1 : 0;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 8 * delta);

    const targetColor = isActive ? "#22d3ee" : "#a78bfa";
    mat.color.lerp(new THREE.Color(targetColor), 6 * delta);
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick(index);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(index);
      }}
      onPointerOut={() => onUnhover()}
    >
      <meshBasicMaterial
        color="#a78bfa"
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Continent Highlight Glow (active coastline overlay) ────
function ContinentHighlights({ activeIndex }: { activeIndex: number | null }) {
  const geometries = useMemo(
    () =>
      coastlineRings.map(ring => {
        const pts = ring.map(([lat, lon]) => llToVec(lat, lon));
        if (pts.length > 0) pts.push(pts[0].clone());
        return new THREE.BufferGeometry().setFromPoints(pts);
      }),
    [],
  );

  return (
    <group>
      {geometries.map((geo, i) => (
        <ContinentGlowLine
          key={i}
          geometry={geo}
          isActive={activeIndex === i}
        />
      ))}
    </group>
  );
}

function ContinentGlowLine({
  geometry,
  isActive,
}: {
  geometry: THREE.BufferGeometry;
  isActive: boolean;
}) {
  const outerRef = useRef<THREE.Line>(null);
  const innerRef = useRef<THREE.Line>(null);
  const pulseRef = useRef(0);

  const outerMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#22d3ee", transparent: true, opacity: 0, depthWrite: false }), []);
  const innerMat = useMemo(() => new THREE.LineBasicMaterial({ color: "#67e8f9", transparent: true, opacity: 0, depthWrite: false }), []);

  useFrame((_, delta) => {
    pulseRef.current += delta * 2.5;
    const target = isActive ? 1 : 0;

    if (outerRef.current) {
      const mat = outerRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, target * 0.55, 5 * delta);
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.LineBasicMaterial;
      const pulse = 0.85 + Math.sin(pulseRef.current) * 0.15;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, target * pulse, 6 * delta);
    }
  });

  return (
    <group>
      {/* Outer glow — wider, softer */}
      <primitive ref={outerRef} object={new THREE.Line(geometry, outerMat)} />
      {/* Inner bright line — pulses */}
      <primitive ref={innerRef} object={new THREE.Line(geometry, innerMat)} />
    </group>
  );
}
// ── Globe: Grid ────────────────────────────────────────────
function Grid() {
  return <group>
    {[-60,-30,0,30,60].map(lat=>{const y=R*Math.sin(THREE.MathUtils.degToRad(lat)),rd=R*Math.cos(THREE.MathUtils.degToRad(lat));return <mesh key={`la${lat}`} position={[0,y,0]}><torusGeometry args={[rd,0.004,6,90]} /><meshBasicMaterial color="#7c3aed" transparent opacity={0.16} depthWrite={false} /></mesh>;})}
    {[0,30,60,90,120,150].map(lon=>{const cu=new THREE.EllipseCurve(0,0,R+0.01,R+0.01,0,Math.PI*2,false,0);const pt=cu.getPoints(70).map(p=>new THREE.Vector3(p.x,0,p.y));const g2=new THREE.BufferGeometry().setFromPoints(pt);return <lineSegments key={`lo${lon}`} geometry={g2} rotation={[0,THREE.MathUtils.degToRad(lon),0]}><lineBasicMaterial color="#7c3aed" transparent opacity={0.16} depthWrite={false} /></lineSegments>;})}
  </group>;
}
// ── Globe: Arcs ────────────────────────────────────────────
function Arcs({ ad }: { ad: ArcDef[] }) {
  const cv = useMemo(()=>ad.map(a=>{const p:THREE.Vector3[]=[];for(let t=0;t<=1;t+=0.03)p.push(cb(t,a.s,a.ma,a.mb,a.e));return p;}),[ad]);
  return <group>{cv.map((pt,i)=><ArcLine key={i} pts={pt} />)}</group>;
}
function ArcLine({ pts }: { pts: THREE.Vector3[] }) {
  const re=useRef<THREE.Line|null>(null);
  const g=useMemo(()=>new THREE.BufferGeometry().setFromPoints(pts),[pts]);
  useFrame(()=>{if(re.current){const m=re.current.material as THREE.LineBasicMaterial;m.opacity=0.2+Math.sin(Date.now()*0.003+pts[0].x*5)*0.16;}});
  // @ts-expect-error
  return <line ref={re} geometry={g}><lineBasicMaterial color="#22d3ee" transparent opacity={0.28} depthWrite={false} /></line>;
}
// ── Globe: Data Packets ────────────────────────────────────
function Packets({ ad }: { ad: ArcDef[] }) {
  const gr=useRef<THREE.Group>(null);
  const ph=useMemo(()=>ad.map(()=>Math.random()),[ad]);
  useFrame((_,d)=>{if(!gr.current)return;ad.forEach((a,i)=>{ph[i]=(ph[i]+d*0.18)%1;const c2=gr.current!.children[i];if(c2)(c2 as THREE.Mesh).position.copy(cb(ph[i],a.s,a.ma,a.mb,a.e));});});
  return <group ref={gr}>{ad.map((_,i)=><mesh key={i}><sphereGeometry args={[0.028,6,6]} /><meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3.5} depthWrite={false} /></mesh>)}</group>;
}
// ── Globe: Atmosphere ──────────────────────────────────────
function Atmo() {
  const rf=useRef<THREE.Mesh>(null);
  const ss=useMemo(()=>({uniforms:{time:{value:0},color:{value:new THREE.Color("#7c3aed")}},vertexShader:`varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`varying vec3 vN;uniform float time;uniform vec3 color;void main(){float i=pow(0.66-dot(vN,vec3(0,0,1)),2.8);float p=0.8+sin(time*0.7)*0.2;gl_FragColor=vec4(color,i*0.2*p);}`}),[]);
  useFrame(()=>{if(rf.current)(rf.current.material as THREE.ShaderMaterial).uniforms.time.value=Date.now()*0.001;});
  return <mesh ref={rf} scale={[1.3,1.3,1.3]}><sphereGeometry args={[R,48,48]} /><shaderMaterial uniforms={ss.uniforms} vertexShader={ss.vertexShader} fragmentShader={ss.fragmentShader} transparent depthWrite={false} side={THREE.BackSide} /></mesh>;
}
// ── Globe: Orbital Ring ────────────────────────────────────
function Ring() {
  const rf=useRef<THREE.Mesh>(null);
  useFrame((_,d)=>{if(rf.current){rf.current.rotation.z+=d*0.1;rf.current.rotation.x+=d*0.06;}});
  return <mesh ref={rf} rotation={[0.8,0.4,0]}><torusGeometry args={[R*1.4,0.007,8,140]} /><meshBasicMaterial color="#a855f7" transparent opacity={0.3} depthWrite={false} /></mesh>;
}
// ── Stars ──────────────────────────────────────────────────
function Stars() {
  const p=useMemo(()=>{const a=new Float32Array(120*3);for(let i=0;i<120;i++){a[i*3]=(Math.random()-0.5)*13;a[i*3+1]=(Math.random()-0.5)*11;a[i*3+2]=(Math.random()-0.5)*7;}return a;},[]);
  const rf=useRef<THREE.Points>(null);
  useFrame((_,d)=>{if(rf.current){rf.current.rotation.y+=d*0.02;rf.current.rotation.x+=d*0.01;}});
  return <points ref={rf}><bufferGeometry><bufferAttribute attach="attributes-position" args={[p,3]} count={120} itemSize={3} /></bufferGeometry><pointsMaterial size={0.016} color="#c084fc" transparent opacity={0.35} sizeAttenuation depthWrite={false} /></points>;
}

/* ═══════════════════════════════════════════════════════════
   SCENE
   ═══════════════════════════════════════════════════════════ */
function Scene() {
  const gr = useRef<THREE.Group>(null);
  useFrame((_, d2) => { if (gr.current) gr.current.rotation.y += d2 * 0.18; });

  const [activeContinent, setActiveContinent] = useState<number | null>(null);
  const [hoveredContinent, setHoveredContinent] = useState<number | null>(null);

  const handleClick = useCallback(
    (i: number) => setActiveContinent(prev => (prev === i ? null : i)),
    [],
  );

  const ad: ArcDef[] = useMemo(() => {
    const pts = genArcPts(8);
    const arcs: ArcDef[] = [];
    for (let k = 0; k < ARC_COUNT; k++) {
      const a = Math.floor(Math.random() * pts.length);
      let b2: number;
      do { b2 = Math.floor(Math.random() * pts.length); } while (pts[a].distanceTo(pts[b2]) < R * 0.85);
      const s = pts[a].clone(), e = pts[b2].clone();
      const m2 = s.clone().add(e).multiplyScalar(0.5).normalize().multiplyScalar(R * 2.5);
      arcs.push({ s, ma: s.clone().lerp(m2, 0.42), mb: e.clone().lerp(m2, 0.42), e });
    }
    return arcs;
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} color="#1a0a2e" />
      <pointLight position={[3, 2, 3]} intensity={2.0} color="#c084fc" />
      <pointLight position={[-3, -1, -2]} intensity={0.8} color="#a855f7" />
      <pointLight position={[0, 3, 0]} intensity={0.6} color="#7c3aed" />
      <pointLight position={[2, 1, 2]} intensity={0.4} color="#c084fc" />
      <pointLight position={[-2, 1, 2]} intensity={0.4} color="#c084fc" />
      <directionalLight position={[0, 0, 8]} intensity={0.5} color="#e9d5ff" />

      <group ref={gr}>
        <Ocean />
        <Grid />
        <Coastlines />
        <ContinentPatches
          activeIndex={activeContinent}
          hoveredIndex={hoveredContinent}
          onClick={handleClick}
          onHover={setHoveredContinent}
          onUnhover={() => setHoveredContinent(null)}
        />
        <ContinentHighlights activeIndex={activeContinent} />
        <Arcs ad={ad} />
        <Packets ad={ad} />
        <Ring />
      </group>

      <Atmo />

      <Satellite />

      <Stars />
    </>
  );
}

export default function NetworkGlobe() {
  return (
    <div className="w-full h-full" aria-label="3D Earth with AI satellite companion" role="img">
      <Canvas camera={{ position: [0, 0.12, 4.8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <Scene />
      </Canvas>
    </div>
  );
}
