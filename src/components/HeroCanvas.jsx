import { Canvas } from '@react-three/fiber';

// Placeholder scene: a single static grey box. The real 3D scene comes later.
export default function HeroCanvas({ onFail }) {
  return (
    <Canvas
      className="hero-canvas"
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [3.2, 2.4, 4.2], fov: 35 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onFail, { once: true });
      }}
      aria-hidden="true"
    >
      <color attach="background" args={['#06192A']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} />
      <mesh rotation={[0, Math.PI / 6, 0]}>
        <boxGeometry args={[1.1, 2.2, 1.1]} />
        <meshStandardMaterial color="#8a8f94" roughness={0.8} />
      </mesh>
    </Canvas>
  );
}
