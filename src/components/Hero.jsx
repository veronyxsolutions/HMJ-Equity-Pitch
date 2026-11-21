import { lazy, Suspense } from 'react';
import { useCan3D } from '../hooks/useCan3D.js';
import ErrorBoundary from './ErrorBoundary.jsx';

// Loaded only when 3D is allowed, so phones never download three.js.
const HeroCanvas = lazy(() => import('./HeroCanvas.jsx'));

// A rendered frame of the same scene (npm run capture:still), shown when 3D is off.
function HeroStill() {
  return (
    <img
      className="hero-still"
      src="/hero-still-864.jpg"
      srcSet="/hero-still-864.jpg 864w, /hero-still-1728.jpg 1728w"
      sizes="(max-width: 767px) 100vw, 60vw"
      alt="A seven-storey limestone apartment building at dusk, with lit windows, balconies and a tree-lined street."
      width="864"
      height="900"
      decoding="async"
    />
  );
}

export default function Hero() {
  const { can3D, markFailed } = useCan3D();

  return (
    <section id="top" className={`hero${can3D ? ' hero--3d' : ' hero--still'}`}>
      <div className="hero__copy">
        <h1 className="hero__title">
          <span>Visions</span> <span>to</span> <span>Assets</span>
        </h1>
        <p className="hero__lede">Curated residences across Dubai, from <span className="nowrap">Off-Plan</span> to Ready.</p>
        <div className="hero__actions">
          <a className="btn btn--solid" href="#off-plan">View Off-Plan</a>
          <a className="btn btn--outline" href="#contact">Book a viewing</a>
        </div>
      </div>

      <div className="hero__visual">
        {can3D ? (
          <ErrorBoundary fallback={<HeroStill />} onError={markFailed}>
            <Suspense fallback={<div className="hero-canvas hero-canvas--loading" />}>
              <HeroCanvas onFail={markFailed} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <HeroStill />
        )}
      </div>
    </section>
  );
}
