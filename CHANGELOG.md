# Changelog

All notable changes to Aurora Fluid are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
