# Third-party assets and licences

## 3D scene
No third-party 3D models or HDRIs are used. The building, street, trees, cars and street lights in `src/scene/` are built procedurally in code for this project. Glass reflections come from drei `<Environment>` with local `<Lightformer>` panels, so no HDRI is downloaded.

If a Poly Haven HDRI (CC0) or a glTF model is added to `/public` later, list it here with its source URL, author and licence (CC0 or CC-BY with the required attribution).

## Fallback still
`public/hero-still-864.jpg` and `public/hero-still-1728.jpg` are renders of the scene above, made with `npm run capture:still`.

## Fonts
Archivo, Playfair Display and Poppins load from Google Fonts under the SIL Open Font License 1.1.

## Code libraries
three (MIT), @react-three/fiber (MIT), @react-three/drei (MIT), React (MIT), Vite (MIT).
