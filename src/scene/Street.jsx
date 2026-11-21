import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// Street section along z (building front at z = 0):
// pavement 0 → 6, kerb, road 6 → 14, far pavement 14 → 18.
export const ROAD = { near: 6, far: 14, laneNear: 8.1, laneFar: 11.9 };

const box = new THREE.BoxGeometry(1, 1, 1);
const m = {
  // Unlit and exactly the page colour, so the foreground meets the hero without a seam.
  ground: new THREE.MeshBasicMaterial({ color: '#020F19' }),
  pavement: new THREE.MeshStandardMaterial({ color: '#B9B1A2', roughness: 0.95 }),
  planting: new THREE.MeshStandardMaterial({ color: '#1C2B23', roughness: 1 }),
  road: new THREE.MeshStandardMaterial({ color: '#23282B', roughness: 0.9 }),
  marking: new THREE.MeshStandardMaterial({ color: '#CFC8B8', roughness: 0.8 }),
  trunk: new THREE.MeshStandardMaterial({ color: '#3B3128', roughness: 1 }),
  canopy: new THREE.MeshStandardMaterial({ color: '#3B5243', roughness: 0.95 }),
  pole: new THREE.MeshStandardMaterial({ color: '#2B2B2A', roughness: 0.5, metalness: 0.6 }),
  lamp: new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#FFE2B8', emissiveIntensity: 1.2 }),
  tyre: new THREE.MeshStandardMaterial({ color: '#141516', roughness: 0.9 }),
  carGlass: new THREE.MeshStandardMaterial({ color: '#141C21', roughness: 0.1, metalness: 0.8 }),
  head: new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#FFF1DC', emissiveIntensity: 1 }),
  tail: new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#C0281E', emissiveIntensity: 1 }),
};

function Slab({ x = [-80, 80], z, y = [0, 0.15], material }) {
  return (
    <mesh
      geometry={box}
      material={material}
      position={[(x[0] + x[1]) / 2, (y[0] + y[1]) / 2, (z[0] + z[1]) / 2]}
      scale={[x[1] - x[0], y[1] - y[0], z[1] - z[0]]}
    />
  );
}

function LaneMarkings() {
  const ref = useRef();
  const mats = useMemo(() => {
    const list = [];
    for (let x = -78; x < 80; x += 7) {
      list.push(new THREE.Matrix4().compose(
        new THREE.Vector3(x, 0.012, (ROAD.near + ROAD.far) / 2),
        new THREE.Quaternion(),
        new THREE.Vector3(3, 0.01, 0.14),
      ));
    }
    return list;
  }, []);
  useLayoutEffect(() => {
    mats.forEach((mx, i) => ref.current.setMatrixAt(i, mx));
    ref.current.instanceMatrix.needsUpdate = true;
  }, [mats]);
  return <instancedMesh ref={ref} args={[box, m.marking, mats.length]} />;
}

/** Abstract model-maker's tree: slim trunk, a loose cluster of three soft crowns. */
const CROWN = [
  [0, 0, 0, 1],
  [0.45, -0.35, 0.25, 0.72],
  [-0.4, -0.25, -0.3, 0.78],
];
export function Tree({ position, height = 6.5, spread = 1.5 }) {
  const trunkH = height * 0.45;
  const crownH = height - trunkH;
  return (
    <group position={position}>
      <mesh material={m.trunk} position={[0, trunkH / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.12, trunkH + 0.6, 8]} />
      </mesh>
      {CROWN.map(([x, y, z, s], i) => (
        <mesh
          key={i}
          material={m.canopy}
          position={[x * spread, trunkH + crownH / 2 + y * crownH * 0.4, z * spread]}
          scale={[spread * s, (crownH / 2) * s, spread * s]}
        >
          <icosahedronGeometry args={[1, 3]} />
        </mesh>
      ))}
    </group>
  );
}

export function StreetLight({ position, facing = 1 }) {
  return (
    <group position={position} scale={[facing, 1, 1]}>
      <mesh material={m.pole} position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 6.4, 8]} />
      </mesh>
      <mesh geometry={box} material={m.pole} position={[0, 6.35, 0.55]} scale={[0.08, 0.08, 1.2]} />
      <mesh geometry={box} material={m.lamp} position={[0, 6.28, 1.05]} scale={[0.22, 0.05, 0.42]} />
    </group>
  );
}

/** Low-detail saloon, ~4.7 m. Faces +x by default. */
export function Car({ position, rotation = 0, color = '#E8E5DE' }) {
  const paint = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.55 }),
    [color],
  );
  const wheels = [
    [1.45, 0.34, 0.82], [1.45, 0.34, -0.82], [-1.5, 0.34, 0.82], [-1.5, 0.34, -0.82],
  ];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[4.7, 0.72, 1.86]} radius={0.2} smoothness={3} position={[0, 0.66, 0]} material={paint} />
      <RoundedBox args={[2.5, 0.56, 1.62]} radius={0.22} smoothness={3} position={[-0.25, 1.22, 0]} material={m.carGlass} />
      {wheels.map((p, i) => (
        <mesh key={i} material={m.tyre} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.24, 16]} />
        </mesh>
      ))}
      <mesh geometry={box} material={m.head} position={[2.34, 0.78, 0.62]} scale={[0.04, 0.1, 0.36]} />
      <mesh geometry={box} material={m.head} position={[2.34, 0.78, -0.62]} scale={[0.04, 0.1, 0.36]} />
      <mesh geometry={box} material={m.tail} position={[-2.34, 0.82, 0]} scale={[0.04, 0.08, 1.5]} />
    </group>
  );
}

export default function Street() {
  return (
    <group name="street">
      <mesh material={m.ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[400, 400]} />
      </mesh>
      <Slab z={[-30, ROAD.near]} material={m.pavement} />
      <Slab z={[ROAD.near, ROAD.far]} y={[0, 0.01]} material={m.road} />
      <Slab z={[ROAD.far, 18.5]} material={m.pavement} />
      {/* Low planting beyond the far pavement, so the foreground isn't empty. */}
      <Slab z={[18.5, 30]} y={[0, 0.35]} material={m.planting} />
      <LaneMarkings />
    </group>
  );
}
