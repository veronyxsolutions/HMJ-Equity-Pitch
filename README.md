# HMJ Equity

Marketing site for HMJ Equity, Dubai's premium British brokerage. Vite + React, with a React Three Fiber hero.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure

- `src/components/Hero.jsx`: split hero. Copy on the left (40%), WebGL on the right (60%).
- `src/components/HeroCanvas.jsx`: placeholder `<Canvas>` (one grey box). Lazy-loaded so three.js only downloads when 3D is allowed.
- `src/hooks/useCan3D.js`: fallback hook. No 3D under 768px, with `prefers-reduced-motion`, without WebGL, or after a render error / context loss. The fallback shows `public/hero-still.svg`, which is a placeholder to be replaced by a rendered still.
- `src/site.js`: nav links, WhatsApp link and contact details.
- `src/styles.css`: design tokens at the top. Brand colours are taken exactly from the brief.

Design guidance: `.claude/skills/frontend-design/SKILL.md`.
