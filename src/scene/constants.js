// Building dimensions in metres. The street facade faces +z; its front plane is z = 0.
export const BAYS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const BAY_W = 3.6; // pier centre to pier centre
export const PIER = 0.45; // pier width
export const RECESS = 0.4; // how far glazing sits behind the stone frame
export const BAND = 0.4; // floor band height
export const GROUND_H = 4.4; // ground floor (lobby + colonnade)
export const FLOOR_H = 3.2;
export const UPPER_FLOORS = 6; // floors 1–6 above ground: 7 storeys in all
export const DEPTH = 14;
export const COLONNADE = 1.25; // lobby glazing set back behind the piers

export const WIDTH = BAYS.length * BAY_W + PIER;
export const HEIGHT = GROUND_H + UPPER_FLOORS * FLOOR_H;
export const PARAPET = 1.1;

export const BALCONY_BAYS = new Set(['B', 'E']);

export const floorBase = (f) => (f === 0 ? 0 : GROUND_H + (f - 1) * FLOOR_H);
export const bayCentre = (i) => -WIDTH / 2 + i * BAY_W + PIER + (BAY_W - PIER) / 2;
export const OPENING_W = BAY_W - PIER;

/** British floor naming: G for ground, then 1–6. Window ids are floor + bay, e.g. "4B", "GA". */
export const floorLabel = (f) => (f === 0 ? 'G' : String(f));

export const COLORS = {
  night: '#020F19',
  stone: '#E9E5DC', // pale limestone, a shade off the sand token #F6F3ED
  stoneShade: '#C9C3B7', // recessed wall inside each opening
  stoneBase: '#A9A398',
  bronze: '#8F6544',
  mullion: '#3A3129',
  glass: '#4A5F70',
  glassLit: '#2A2620',
  lit: '#F2C189',
  forest: '#083819',
};
