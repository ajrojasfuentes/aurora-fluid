# Changelog

All notable changes to Aurora Fluid are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] — 2026-08-13

### Added
- Documented `blobSize` (and `--af-blob-size`) configuration in `README.md`.
- Added missing blob configuration properties to the JSDoc in `aurora.js`.

### Fixed
- `removeAurora()` now correctly removes injected `.aurora-blobs` elements from the DOM, preventing orphaned HTML elements and memory leaks.
- Updated `removeAurora` description in `aurora.d.ts` to reflect the blob removal behavior.

## [1.1.0] — 2026-08-13

### Added

- **Organic particle system (blobs):** `.aurora-blobs` container and `.aurora-blob` base class for volumetric floating particles
- `blobs` config option — number of particles to inject (0–10)
- `blobDrift` config option — spatial movement multiplier
- `blobDeformation` config option — morphing speed multiplier
- `blobChaos` config option — temporal desynchronization multiplier
- `--af-drift` custom property for per-blob drift amplitude
- 3 drift keyframes (`aurora-drift-1`, `aurora-drift-2`, `aurora-drift-3`) with parametric `translate()` + `scale()`
- 3 morph keyframes (`aurora-morph-1`, `aurora-morph-2`, `aurora-morph-3`) using 8-point `border-radius` deformation
- Mask support for blobs inside `.aurora-mask` and `.aurora-border` containers
- `.aurora-hover` modifier — starts `--af-intensity` at 0 and transitions to 1 on `:hover` over 700 ms
- `@property --af-intensity` registration for smooth CSS transitions of computed values
- Deterministic PRNG (`mulberry32`) for stable blob positioning across configuration updates
- `build.js` build script using esbuild for minification
- `aurora.min.css` and `aurora.min.js` minified production assets
- `npm run build` script in `package.json`
- Blobs Count, Drift Amount, Deformation, and Chaos Level sliders in the demo sidebar
- "Organic Particle System" demo card with `.aurora-hover` orchestration
- `esbuild` as a dev dependency

### Changed

- Version bumped to `1.1.0`
- `filter: blur()` on blobs consolidated from per-particle (N GPU operations) to per-container (1 GPU operation)
- `will-change` declarations moved from permanent inline to conditional `@media not (prefers-reduced-motion: reduce)` block
- `contain: strict` added to `.aurora-blobs` for aggressive repaint isolation
- Blob duration arrays (`DRIFT_DURATIONS`, `MORPH_DURATIONS`) promoted to module-level constants
- Blob DOM nodes are now reused across `applyAurora()` calls instead of being destroyed and recreated
- Demo `refresh()` function now applies custom properties globally on `:root` (without blobs) and applies the full config (with blobs) only to valid container elements
- `prefers-reduced-motion` media query now includes `.aurora-blob` selector
- `package.json` `files` array now includes minified assets

### Fixed

- `.aurora-hover` elements were always visible because `applyAurora()` wrote `--af-intensity: 1` as an inline style, which has higher specificity than the class-level `--af-intensity: 0` declaration. `applyAurora()` now skips writing `--af-intensity` inline when the target element has the `.aurora-hover` class.

## [1.0.0] — 2026-08-12

### Breaking Changes

- Renamed all CSS custom properties from `--n-*` to `--af-*`
- Renamed all CSS classes from `.nebula*` to `.aurora*`
- Renamed keyframe from `nebula-flow-x` to `aurora-flow-x`
- Renamed JS functions from `*Nebula*` to `*Aurora*`
- Renamed JS config parameter `speed` → `duration`
- Renamed JS config parameter `alpha` → `opacity`
- Renamed JS config parameter `size` → `waveWidth`
- Renamed JS config parameter `ease` → `easing`

### Added

- `--af-state` custom property (`running` / `paused`) for animation control
- `--af-delay` custom property for stagger effects between instances
- `--af-intensity` custom property as a global multiplier (0-1) that scales blur and opacity
- `--af-noise-freq` and `--af-noise-octaves` for configurable fractal noise (JS)
- `--af-border-width` and `--af-radius` promoted to `:root` (were component-scoped)
- `aurora-flow-y` keyframe and `.aurora-flow-y` CSS class for vertical animation
- `animation-play-state` and `animation-delay` support on all surfaces
- `contain: layout style paint` on `.aurora` for rendering performance
- `removeAurora()` function to clean up custom properties from an element
- `PRESETS` export with 5 ready-to-use configurations (aurora, sunset, ocean, neon, monochrome)
- `aurora.d.ts` TypeScript type definitions
- `buildNoiseBg()` internal helper for dynamic noise SVG generation
- `.aurora-border` and `.aurora-mask` demo cards (were documented but not shown)
- Easing, direction, pause, and preset controls in the demo
- 6 color pickers in the demo (was 4)
- Responsive layout for demo sidebar on mobile (< 768px)
- `README.md` with full API documentation
- `package.json` with `type: "module"`
- `CHANGELOG.md`

### Fixed

- `buildAuroraGradient()` first-color extraction no longer breaks with `color-mix()` values
- `mask-size` mismatch between CSS file and demo (unified to `contain`)
- `--af-radius` mismatch between CSS file and demo (unified to `1.25rem`)
- Missing `mask-position: center` in CSS file for `.aurora-mask::before`
- `.aurora-mask::before` now included in `prefers-reduced-motion` media query
- Demo now imports real library files (`aurora.css` via `<link>`, `aurora.js` via `<script type="module">`) — eliminates all code drift

### Removed

- Inline duplicated CSS/JS engine code from the demo HTML
