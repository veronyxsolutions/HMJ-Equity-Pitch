import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Fixed three-quarter camera with a slight ease toward the pointer.
 * Renders on demand: frames are requested only while the camera is still settling.
 */
export default function Rig({ position, target, sway = [1.6, 0.8] }) {
  const { camera, invalidate } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const base = useRef(new THREE.Vector3(...position));
  const look = useRef(new THREE.Vector3(...target));

  useEffect(() => {
    base.current.set(...position);
    look.current.set(...target);
    camera.position.copy(base.current);
    camera.lookAt(look.current);
    invalidate();
  }, [camera, invalidate, position, target]);

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
      invalidate();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const tx = base.current.x + pointer.current.x * sway[0];
    const ty = base.current.y - pointer.current.y * sway[1];
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2.5, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2.5, dt);
    camera.lookAt(look.current);
    if (Math.abs(camera.position.x - tx) > 0.002 || Math.abs(camera.position.y - ty) > 0.002) invalidate();
  });

  return null;
}
