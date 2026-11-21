# HMJ Equity — Visions to Assets

Cinematic landing page for HMJ Equity Real Estate (Business Bay, Dubai).
Vite + React 18 + TypeScript + Tailwind CSS 3.4, `lucide-react` for the one icon.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

## Structure

- `src/components/SplashScreen.tsx`: plays `/media/splash.mp4` once, then fades out (skipped on reduced motion, autoplay refusal or error)
- `src/components/HeroSection.tsx`: looping hero video (loads only after the splash), logo, heading, morphing bottom bar, popup menu
- `src/components/ScrollGallery.tsx`: 900vh scroll-driven gallery overlay (line → wipe → 3 images → text → cream)
- `public/logo.png`, `public/media/*`: all media is local; no third-party CDNs

## Deploy (Cloudflare Pages)

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `/`
- Node version: 18 or 20
- Pushes to `main` publish. No environment secrets needed.
