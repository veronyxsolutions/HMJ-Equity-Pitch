import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import Building from '../scene/Building.jsx';
import Street, { Car, StreetLight, Tree, ROAD } from '../scene/Street.jsx';
import Rig from '../scene/Rig.jsx';
import { COLORS } from '../scene/constants.js';

const CAMERA = { position: [50, 7, 72], target: [3.5, 12.5, -2] };

export default function HeroCanvas({ onFail }) {
  return (
    <Canvas
      className="hero-canvas"
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: CAMERA.position, fov: 26, near: 0.5, far: 400 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onFail, { once: true });
      }}
      aria-hidden="true"
    >
      {/* Same colour as the hero background, so the ground dissolves into the page. */}
      <fog attach="fog" args={[COLORS.night, 70, 150]} />

      {/* Dusk: cool sky fill, low warm sun raking the facade from the west. */}
      <hemisphereLight args={['#9DB2C8', '#2A2520', 1.1]} />
      <directionalLight position={[-40, 12, 34]} intensity={1.25} color="#FFD9B8" />
      <directionalLight position={[40, 26, 20]} intensity={0.45} color="#B8C8DA" />

      {/* Reflections for the glass, built locally (no HDRI download). */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={0.7} color="#6F88A3" position={[0, 60, 0]} rotation-x={Math.PI / 2} scale={[200, 200, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#34506E" position={[-40, 40, 60]} scale={[220, 90, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#E9A877" position={[-40, 6, 70]} scale={[220, 8, 1]} />
      </Environment>

      <group position={[0, 0.15, 0]}>
        <Building />
      </group>
      <Street />

      <Tree position={[-15.5, 0.15, 4.2]} height={7} spread={1.6} />
      <Tree position={[15.8, 0.15, 4.2]} height={6.4} spread={1.45} />
      <Tree position={[24, 0.15, 4.2]} height={7.2} spread={1.6} />
      <Tree position={[-3, 0.15, 16.6]} height={6} spread={1.4} />
      <Tree position={[9, 0.15, 16.6]} height={6.8} spread={1.5} />
      <Tree position={[30, 0.35, 21]} height={7.4} spread={1.7} />

      <StreetLight position={[-8.5, 0.15, 5.3]} />
      <StreetLight position={[19.5, 0.15, 5.3]} />

      <Car position={[3.5, 0, ROAD.laneNear]} color="#E8E5DE" />
      <Car position={[-9, 0, ROAD.laneFar]} rotation={Math.PI} color="#2A3034" />
      <Car position={[17, 0, ROAD.laneFar]} rotation={Math.PI} color="#1D3326" />

      <ContactShadows position={[0, 0.16, 2]} scale={[90, 50]} resolution={1024} blur={2.4} far={14} opacity={0.55} frames={1} />

      <Rig position={CAMERA.position} target={CAMERA.target} />
    </Canvas>
  );
}
