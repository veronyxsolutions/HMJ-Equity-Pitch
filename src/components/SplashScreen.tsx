import { useCallback, useEffect, useRef, useState } from 'react';
import { getPrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SplashScreenProps {
  onComplete: () => void;
}

/** Longest we will ever hold the splash, in case the video stalls. */
const SAFETY_TIMEOUT_MS = 12000;

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isFading, setIsFading] = useState(false);
  const [skipVideo] = useState(getPrefersReducedMotion);
  const finishedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finish = useCallback(
    (delay = 0) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      window.setTimeout(() => {
        setIsFading(true);
        window.setTimeout(onComplete, 800);
      }, delay);
    },
    [onComplete],
  );

  useEffect(() => {
    if (skipVideo) {
      finish(400);
      return;
    }
    const safety = window.setTimeout(() => finish(), SAFETY_TIMEOUT_MS);
    // Autoplay can be refused (e.g. iOS Low Power Mode). Never trap the user.
    const playAttempt = videoRef.current?.play();
    playAttempt?.catch(() => finish(400));
    return () => window.clearTimeout(safety);
  }, [skipVideo, finish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center transition-opacity duration-700 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {!skipVideo && (
        <video
          ref={videoRef}
          className="absolute top-[20%] left-[30%] md:left-[55%] md:-translate-x-1/2 w-[320px] sm:w-[390px] md:w-[750px] aspect-video object-contain"
          src="/media/splash.mp4"
          poster="/media/splash-poster.jpg"
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={() => finish()}
          onError={() => finish(400)}
        />
      )}
    </div>
  );
}
