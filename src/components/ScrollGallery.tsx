import { useEffect, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const IMAGES = [
  { src: '/media/gallery-01.jpg', alt: 'Valia Tower at dusk, Dubai Creek Harbour' },
  { src: '/media/gallery-02.jpg', alt: 'Bedroom with a view over the marina and skyline' },
  { src: '/media/gallery-03.jpg', alt: 'Business Bay skyline at night' },
];

/** Phase ranges (fractions of total scroll progress). */
const LINE = [0, 0.06] as const;
const EXPAND = [0.06, 0.16] as const;
const IMAGE_PHASES = [
  [0.16, 0.34],
  [0.34, 0.5],
  [0.5, 0.64],
] as const;
const TEXT = [0.64, 0.78] as const;
const MORPH = [0.78, 0.9] as const;
const FINAL = [0.9, 1] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const phase = (p: number, [start, end]: readonly [number, number]) => clamp01((p - start) / (end - start));

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? clamp01(window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}

/** Scale-from-centre reveal used by the images and the black text screen. */
function revealStyle(t: number, reduced: boolean): CSSProperties {
  if (reduced) return { opacity: t, visibility: t > 0 ? 'visible' : 'hidden' };
  return {
    transform: `scale(${0.2 + t * 0.8})`,
    opacity: Math.min(1, t * 4),
    visibility: t > 0 ? 'visible' : 'hidden',
  };
}

export default function ScrollGallery() {
  const p = useScrollProgress();
  const reduced = usePrefersReducedMotion();

  // Phase 1 + 2: black line grows, then wipes to full width.
  const lineT = phase(p, LINE);
  const expandT = easeInOutCubic(phase(p, EXPAND));
  const lineWidth = p < EXPAND[0] ? `${lineT * 50}px` : `calc(50px + (100vw - 50px) * ${expandT})`;
  const lineStyle: CSSProperties = reduced
    ? { width: '100vw', opacity: phase(p, [0, EXPAND[1]]) }
    : { width: lineWidth, opacity: p > 0 ? 1 : 0 };

  const textT = phase(p, TEXT);
  const morphT = phase(p, MORPH);
  const finalT = phase(p, FINAL);
  const r = Math.round(morphT * 246);
  const g = Math.round(morphT * 243);
  const b = Math.round(morphT * 237);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none" aria-hidden={p === 0}>
      {/* Black line / wipe */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-black" style={lineStyle} />

      {/* Images */}
      {IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 flex items-center justify-center"
          style={revealStyle(phase(p, IMAGE_PHASES[i]), reduced)}
        >
          <img
            src={img.src}
            alt={img.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-[85vw] h-auto max-w-[900px] aspect-[16/10] rounded-lg sm:w-full sm:h-full sm:max-w-none sm:aspect-auto sm:rounded-none object-cover"
          />
        </div>
      ))}

      {/* Text screen: black, then morphs to cream */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ ...revealStyle(textT, reduced), backgroundColor: `rgb(${r}, ${g}, ${b})` }}
      >
        <p
          className="absolute font-geist font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-[1.3] max-w-3xl px-6 text-white"
          style={{ opacity: 1 - morphT }}
        >
          Access exceptional off-plan and ready homes across <span className="text-[#2E8748]">Dubai.</span>
        </p>
        <p
          className="absolute font-geist font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-[1.3] max-w-3xl px-6 text-[#083819]"
          style={{ opacity: finalT }}
        >
          Guided by insight, built on <span className="text-[#2E8748]">trust.</span>
        </p>
      </div>
    </div>
  );
}
