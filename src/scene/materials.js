import * as THREE from 'three';
import { COLORS } from './constants.js';

// Interior light falls off from the ceiling: brighter at the top of each window.
function ceilingGradient() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.35, '#b8b8b8');
  grad.addColorStop(1, '#3a3a3a');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const ceiling = ceilingGradient();

// Shared materials, created once. Windows swap between glass / glassLit / glassHover later.
export const mats = {
  stone: new THREE.MeshStandardMaterial({ color: COLORS.stone, roughness: 0.82 }),
  stoneShade: new THREE.MeshStandardMaterial({ color: COLORS.stoneShade, roughness: 0.9 }),
  stoneBase: new THREE.MeshStandardMaterial({ color: COLORS.stoneBase, roughness: 0.9 }),
  mullion: new THREE.MeshStandardMaterial({ color: COLORS.mullion, roughness: 0.5, metalness: 0.6 }),
  bronze: new THREE.MeshStandardMaterial({ color: COLORS.bronze, roughness: 0.4, metalness: 0.8 }),
  // Dusk glass: picks up the cool sky rather than reading as a black hole.
  glass: new THREE.MeshStandardMaterial({ color: COLORS.glass, roughness: 0.22, metalness: 0.35 }),
  // Interior light seen through glass: warm, falling off from the ceiling.
  glassLit: new THREE.MeshStandardMaterial({
    color: '#000000',
    emissive: COLORS.lit,
    emissiveMap: ceiling,
    emissiveIntensity: 0.55,
    roughness: 0.2,
    metalness: 0.3,
  }),
  balustrade: new THREE.MeshStandardMaterial({
    color: '#BFD0D6',
    roughness: 0.05,
    metalness: 0.2,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  }),
};

// Deterministic "random" so the lit pattern is identical on every load.
export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
