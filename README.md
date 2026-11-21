# HMJ Equity

Marketing site for HMJ Equity, Dubai's premium British brokerage. Vite + React, with a React Three Fiber hero.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure

- `src/components/Hero.jsx`: split hero. Copy on the left (40%), WebGL on the right (60%).
- `src/components/HeroCanvas.jsx`: the hero `<Canvas>`, covering lights, environment, contact shadows and the camera. Lazy-loaded so three.js only downloads when 3D is allowed. Renders on demand: frames are drawn only while the camera eases after a pointer move.
- `src/scene/`: procedural building (`Building.jsx`), street, trees, cars and lights (`Street.jsx`), camera ease (`Rig.jsx`), dimensions and colours (`constants.js`).
  - Every street-facade window is its own mesh, named floor + bay: `GA`–`GF` (ground-floor lobby), then `1A`–`6F`. Each has `userData { id, floor, unit, lit }`, and they all sit in the group `street-facade-windows`, ready for raycasting.
- `src/hooks/useCan3D.js`: fallback hook. No 3D under 768px, with `prefers-reduced-motion`, without WebGL, or after a render error / context loss. The fallback shows `public/hero-still-*.jpg`, a render of the same scene. After changing the scene, run `npm run dev`, then `npm run capture:still` to refresh it (uses Playwright with Chromium).
- `src/site.js`: nav links, WhatsApp link and contact details.
- `src/styles.css`: design tokens at the top. Brand colours are taken exactly from the brief.

Design guidance: `.claude/skills/frontend-design/SKILL.md`.
