import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import HeroSection from './components/HeroSection';
import ScrollGallery from './components/ScrollGallery';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="bg-black h-[900vh]">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <HeroSection ready={!showSplash} />
      <ScrollGallery />
    </div>
  );
}
