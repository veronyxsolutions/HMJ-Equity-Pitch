import { useEffect, useState } from 'react';

const SMALL_SCREEN = '(max-width: 767px)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

let webglCache;
export function hasWebGL() {
  if (webglCache !== undefined) return webglCache;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webglCache = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function evaluate() {
  if (typeof window === 'undefined') return { can3D: false, reason: 'ssr' };
  if (window.matchMedia(SMALL_SCREEN).matches) return { can3D: false, reason: 'small-screen' };
  if (window.matchMedia(REDUCED_MOTION).matches) return { can3D: false, reason: 'reduced-motion' };
  if (!hasWebGL()) return { can3D: false, reason: 'no-webgl' };
  return { can3D: true, reason: null };
}

/**
 * Decides whether the hero may render the WebGL scene.
 * Falls back (can3D: false) under 768px, when prefers-reduced-motion is set,
 * when WebGL is unavailable, or after markFailed() is called (e.g. context lost
 * or a render error caught by the boundary). Re-evaluates on resize/media changes.
 */
export function useCan3D() {
  const [state, setState] = useState(evaluate);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const queries = [SMALL_SCREEN, REDUCED_MOTION].map((q) => window.matchMedia(q));
    const update = () => setState(evaluate());
    queries.forEach((mq) => mq.addEventListener('change', update));
    return () => queries.forEach((mq) => mq.removeEventListener('change', update));
  }, []);

  return {
    can3D: state.can3D && !failed,
    reason: failed ? 'render-failed' : state.reason,
    markFailed: () => setFailed(true),
  };
}
