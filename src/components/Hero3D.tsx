import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Starfield({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#93c5fd"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Core() {
  const knot = useRef<THREE.Mesh>(null!);
  const inner = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    knot.current.rotation.x += delta * 0.12;
    knot.current.rotation.y += delta * 0.18;
    inner.current.rotation.y -= delta * 0.35;
    inner.current.rotation.z += delta * 0.1;
    inner.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.06);
    halo.current.rotation.z += delta * 0.05;
  });

  return (
    <group>
      <mesh ref={knot}>
        <torusKnotGeometry args={[2.1, 0.62, 220, 28]} />
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          emissive="#1d4ed8"
          emissiveIntensity={0.7}
          transparent
          opacity={0.45}
        />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color="#22d3ee"
          wireframe
          emissive="#0891b2"
          emissiveIntensity={1.4}
        />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.4, 0.012, 8, 120]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

const SHAPES: Array<{ pos: [number, number, number]; scale: number; color: string; kind: "octa" | "tetra" | "box" }> = [
  { pos: [-4.6, 1.8, -2], scale: 0.34, color: "#60a5fa", kind: "octa" },
  { pos: [4.8, -1.4, -1.5], scale: 0.4, color: "#22d3ee", kind: "tetra" },
  { pos: [-3.8, -2.2, -1], scale: 0.26, color: "#818cf8", kind: "box" },
  { pos: [3.9, 2.4, -2.5], scale: 0.3, color: "#38bdf8", kind: "octa" },
  { pos: [-5.4, -0.3, -3], scale: 0.36, color: "#2dd4bf", kind: "tetra" },
  { pos: [5.6, 0.9, -3], scale: 0.24, color: "#93c5fd", kind: "box" },
];

function FloatingShapes() {
  return (
    <group>
      {SHAPES.map((s, i) => (
        <Float key={i} speed={1.4 + i * 0.25} rotationIntensity={1.4} floatIntensity={1.6}>
          <mesh position={s.pos} scale={s.scale}>
            {s.kind === "octa" && <octahedronGeometry args={[1, 0]} />}
            {s.kind === "tetra" && <tetrahedronGeometry args={[1, 0]} />}
            {s.kind === "box" && <boxGeometry args={[1, 1, 1]} />}
            <meshStandardMaterial color={s.color} wireframe emissive={s.color} emissiveIntensity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    const { pointer } = state;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.3, 2.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.2, 2.5, delta);
  });
  return <group ref={group}>{children}</group>;
}

export default function Hero3D() {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.5], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 6, 6]} intensity={60} color="#3b82f6" />
      <pointLight position={[-6, -4, 5]} intensity={40} color="#22d3ee" />
      <Rig>
        <Starfield />
        <Core />
        <FloatingShapes />
      </Rig>
    </Canvas>
  );
}
