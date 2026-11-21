import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  BAYS, BAY_W, PIER, RECESS, BAND, GROUND_H, FLOOR_H, UPPER_FLOORS, DEPTH, COLONNADE,
  WIDTH, HEIGHT, PARAPET, BALCONY_BAYS, OPENING_W, floorBase, bayCentre, floorLabel,
} from './constants.js';
import { mats, seeded } from './materials.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const unitPlane = new THREE.PlaneGeometry(1, 1);

/** Axis-aligned box from min/max corners. */
function Block({ min, max, material }) {
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const pos = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2];
  return <mesh geometry={unitBox} material={material} position={pos} scale={size} />;
}

/** Window opening geometry for a floor: [bottom, height]. */
function openingFor(f) {
  if (f === 0) return [0.12, GROUND_H - 0.3];
  const base = floorBase(f) + BAND;
  return [base + 0.12, FLOOR_H - BAND - 0.24];
}

/**
 * Street-facade windows: one mesh per window, named by floor + bay ("GA" … "6F"),
 * with userData { id, floor, unit, lit } so they can be raycast and highlighted later.
 */
function StreetWindows() {
  const windows = useMemo(() => {
    const rand = seeded(20261121);
    const list = [];
    for (let f = 0; f <= UPPER_FLOORS; f++) {
      const [bottom, h] = openingFor(f);
      BAYS.forEach((unit, i) => {
        const id = `${floorLabel(f)}${unit}`;
        const lit = f === 0 ? true : rand() < 0.3;
        const z = f === 0 ? -COLONNADE + 0.01 : -RECESS + 0.01;
        list.push({ id, floor: f, unit, lit, position: [bayCentre(i), bottom + h / 2, z], scale: [OPENING_W, h, 1] });
      });
    }
    return list;
  }, []);

  return (
    <group name="street-facade-windows">
      {windows.map((w) => (
        <mesh
          key={w.id}
          name={w.id}
          geometry={unitPlane}
          material={w.lit ? mats.glassLit : mats.glass}
          position={w.position}
          scale={w.scale}
          userData={{ id: w.id, floor: w.floor, unit: w.unit, lit: w.lit }}
        />
      ))}
    </group>
  );
}

/** Side (east) facade glazing: instanced, not individually addressable. */
function SideWindows() {
  const unlitRef = useRef();
  const litRef = useRef();
  const sideBays = 4;
  const sideBayW = DEPTH / sideBays;

  const { unlit, lit } = useMemo(() => {
    const rand = seeded(7);
    const out = { unlit: [], lit: [] };
    for (let f = 1; f <= UPPER_FLOORS; f++) {
      const [bottom, h] = openingFor(f);
      for (let j = 0; j < sideBays; j++) {
        const z = -DEPTH + j * sideBayW + PIER + (sideBayW - PIER) / 2;
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(WIDTH / 2 - RECESS + 0.01, bottom + h / 2, z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
          new THREE.Vector3(sideBayW - PIER, h, 1),
        );
        (rand() < 0.3 ? out.lit : out.unlit).push(m);
      }
    }
    return out;
  }, [sideBayW]);

  useLayoutEffect(() => {
    unlit.forEach((m, i) => unlitRef.current.setMatrixAt(i, m));
    lit.forEach((m, i) => litRef.current.setMatrixAt(i, m));
    unlitRef.current.instanceMatrix.needsUpdate = true;
    litRef.current.instanceMatrix.needsUpdate = true;
  }, [unlit, lit]);

  return (
    <>
      <instancedMesh ref={unlitRef} args={[unitPlane, mats.glass, unlit.length]} />
      <instancedMesh ref={litRef} args={[unitPlane, mats.glassLit, lit.length]} />
    </>
  );
}

/** One slim vertical mullion per upper-floor street window, instanced. */
function Mullions() {
  const ref = useRef();
  const matrices = useMemo(() => {
    const list = [];
    for (let f = 1; f <= UPPER_FLOORS; f++) {
      const [bottom, h] = openingFor(f);
      BAYS.forEach((_, i) => {
        list.push(new THREE.Matrix4().compose(
          new THREE.Vector3(bayCentre(i), bottom + h / 2, -RECESS + 0.04),
          new THREE.Quaternion(),
          new THREE.Vector3(0.06, h, 0.06),
        ));
      });
    }
    // Lobby: two mullions per bay.
    BAYS.forEach((_, i) => {
      [-1, 1].forEach((s) => list.push(new THREE.Matrix4().compose(
        new THREE.Vector3(bayCentre(i) + s * OPENING_W / 6, GROUND_H / 2, -COLONNADE + 0.04),
        new THREE.Quaternion(),
        new THREE.Vector3(0.06, GROUND_H - 0.3, 0.06),
      )));
    });
    return list;
  }, []);

  useLayoutEffect(() => {
    matrices.forEach((m, i) => ref.current.setMatrixAt(i, m));
    ref.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return <instancedMesh ref={ref} args={[unitBox, mats.mullion, matrices.length]} />;
}

function Balconies() {
  const items = [];
  for (let f = 1; f <= UPPER_FLOORS; f++) {
    const y = floorBase(f) + BAND;
    BAYS.forEach((unit, i) => {
      if (!BALCONY_BAYS.has(unit)) return;
      const x = bayCentre(i);
      const w = BAY_W + 0.1;
      const d = 1.45;
      items.push(
        <group key={`${f}${unit}`}>
          <Block min={[x - w / 2, y - 0.16, 0]} max={[x + w / 2, y, d]} material={mats.stone} />
          <Block min={[x - w / 2 + 0.05, y, d - 0.04]} max={[x + w / 2 - 0.05, y + 1.02, d - 0.02]} material={mats.balustrade} />
          <Block min={[x - w / 2 + 0.05, y + 1.02, d - 0.06]} max={[x + w / 2 - 0.05, y + 1.07, d]} material={mats.bronze} />
        </group>,
      );
    });
  }
  return <group name="balconies">{items}</group>;
}

export default function Building(props) {
  const half = WIDTH / 2;
  const sideBayW = DEPTH / 4;

  return (
    <group name="building" {...props}>
      {/* Recessed walls behind the glazing */}
      <Block min={[-half, 0, -DEPTH]} max={[half - COLONNADE, GROUND_H, -COLONNADE]} material={mats.stoneBase} />
      <Block min={[-half, GROUND_H, -DEPTH]} max={[half - RECESS, HEIGHT, -RECESS]} material={mats.stoneShade} />

      {/* Floor bands, full footprint (also form the colonnade soffit) */}
      {Array.from({ length: UPPER_FLOORS }, (_, k) => {
        const y = floorBase(k + 1);
        return <Block key={k} min={[-half, y, -DEPTH]} max={[half, y + BAND, 0]} material={mats.stone} />;
      })}

      {/* Parapet and roof */}
      <Block min={[-half, HEIGHT, -DEPTH]} max={[half, HEIGHT + PARAPET, 0]} material={mats.stone} />
      <Block min={[-half + 5, HEIGHT + PARAPET, -DEPTH + 3]} max={[half - 7, HEIGHT + PARAPET + 2.2, -5]} material={mats.stoneShade} />

      {/* Street piers, full height */}
      {Array.from({ length: BAYS.length + 1 }, (_, j) => {
        const x = -half + j * BAY_W;
        return <Block key={j} min={[x, 0, -RECESS]} max={[x + PIER, HEIGHT, 0]} material={mats.stone} />;
      })}

      {/* East piers */}
      {Array.from({ length: 4 }, (_, j) => {
        const z = -DEPTH + j * sideBayW;
        return <Block key={j} min={[half - RECESS, 0, z]} max={[half, HEIGHT, Math.min(z + PIER, 0)]} material={mats.stone} />;
      })}

      <StreetWindows />
      <SideWindows />
      <Mullions />
      <Balconies />
    </group>
  );
}
