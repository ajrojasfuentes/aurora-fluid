# Aurora Fluid

A reusable animated gradient engine for the web. One CSS file, seven surfaces, organic particles, zero dependencies.

> **~3.6 KB gzipped** — minified builds included.

## Features

- 🎨 **7 surfaces** — background, text, border, mask, full-page, noise, volumetric blobs
- 🫧 **Organic particles** — floating, morphing blob system with drift, deformation, and chaos controls
- ⚡ **CSS-only core** — works without JavaScript; JS helper is optional
- 🎛️ **Custom properties** — configure everything via `--af-*` variables
- 🎬 **Direction control** — horizontal or vertical flow
- ⏸️ **Play / pause** — animation state control via CSS or JS
- 🌗 **Hover orchestration** — smooth 700 ms fade-in via `.aurora-hover`
- 📦 **Presets** — 5 built-in themes (aurora, sunset, ocean, neon, monochrome)
- ♿ **Accessible** — respects `prefers-reduced-motion`
- 🔷 **TypeScript** — full type definitions included
- 🏎️ **GPU-optimised** — consolidated blur, strict containment, conditional `will-change`

## Installation

### Copy

Download `aurora.css` (or `aurora.min.css`) and optionally `aurora.js` (or `aurora.min.js`) into your project.

### npm

```bash
npm install aurora-fluid
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/aurora-fluid/aurora.min.css">
<script type="module" src="https://unpkg.com/aurora-fluid/aurora.min.js"></script>
```

## Quick Start

### CSS-only (no JavaScript)

```html
<link rel="stylesheet" href="aurora.css">

<!-- Animated background -->
<div class="aurora">Your content here</div>

<!-- Gradient text -->
<h1 class="aurora-text">Hello World</h1>

<!-- Animated border -->
<div class="aurora-border">Bordered content</div>

<!-- Hover-activated glow -->
<div class="aurora aurora-hover">Hover me</div>
```

### With JavaScript

```html
<link rel="stylesheet" href="aurora.css">
<script type="module">
  import { applyAurora, PRESETS } from './aurora.js';

  // Custom configuration
  applyAurora(document.querySelector('.my-card'), {
    colors: [
      { color: '#7c3aed' },
      { color: '#e879f9' },
      { color: '#38bdf8', alpha: 0.6 },
    ],
    duration: '12s',
    blur: '60px',
    blend: 'screen',
  });

  // Or use a preset
  applyAurora(document.querySelector('.hero'), PRESETS.sunset);

  // With organic blobs
  applyAurora(document.querySelector('.nebula'), {
    colors: [
      { color: '#a855f7' },
      { color: '#e879f9' },
      { color: '#2dd4bf' },
      { color: '#38bdf8' },
    ],
    blobs: 6,
    blobDrift: 1.5,
    blobDeformation: 1.2,
    blobChaos: 2,
  });
</script>
```

## Custom Properties (CSS API)

Override these on `:root` (global), on a class, or inline on any element.

### Core

| Property | Default | Description |
|---|---|---|
| `--af-gradient` | _(purple-pink-teal gradient)_ | The full `linear-gradient()` value |
| `--af-wave-width` | `200vw` | Width of one color cycle (wave amplitude) |
| `--af-duration` | `18s` | Duration of one full animation cycle |
| `--af-blur` | `40px` | Gaussian blur of the animated layer |
| `--af-opacity` | `0.7` | Global opacity of the animated layer |
| `--af-blend` | `screen` | `mix-blend-mode` for the layer |
| `--af-easing` | `linear` | Animation timing function |
| `--af-state` | `running` | `running` or `paused` |
| `--af-delay` | `0s` | Animation delay (useful for staggering) |
| `--af-intensity` | `1` | Global multiplier (0–1) that scales blur & opacity |

### Textures

| Property | Default | Description |
|---|---|---|
| `--af-noise` | `0` | Grain texture intensity (0–1) |
| `--af-noise-freq` | `0.85` | Fractal noise base frequency (JS-configurable) |
| `--af-noise-octaves` | `3` | Fractal noise octaves (JS-configurable) |

### Shape & Border

| Property | Default | Description |
|---|---|---|
| `--af-mask` | `none` | Mask silhouette for `.aurora-mask` |
| `--af-border-width` | `2px` | Animated border thickness |
| `--af-radius` | `1.25rem` | Border radius for `.aurora-border` |

### Blobs (JS-configurable)

| Property | Default | Description |
|---|---|---|
| `--af-drift` | `1` | Spatial movement multiplier for blob drifting |

> **Note:** `--af-intensity` is registered via `@property` for smooth CSS transitions. When using `.aurora-hover`, the property transitions from `0` to `1` over 700 ms.

## Surfaces

### 1. `.aurora` — Animated Background

The gradient animates in a `::before` pseudo-element. Your content (direct children) stays above it via z-index, so text and icons remain crisp.

```html
<div class="aurora" style="border-radius: 1rem; height: 200px;">
  <p>Content stays sharp</p>
</div>
```

### 2. `.aurora-text` — Gradient Text Fill

The gradient becomes the text color via `background-clip: text`. No blur is applied.

```html
<h1 class="aurora-text">Gradient Title</h1>
```

### 3. `.aurora-border` — Animated Border

Uses a double-mask XOR technique to reveal only the border ring.

```html
<div class="aurora-border" style="--af-border-width: 3px;">
  <div style="padding: 20px;">Bordered content</div>
</div>
```

### 4. `.aurora-mask` — Masked Silhouette

Clips the animated layer with any SVG shape or image mask.

```html
<div class="aurora aurora-mask"
     style="--af-mask: url('star.svg'); width: 200px; height: 200px;">
</div>
```

### 5. `.aurora-page` — Full-Page Background

Fixed to the viewport, behind everything.

```html
<div class="aurora aurora-page"></div>
```

### 6. `.aurora-noise` — Grain Texture

Stacks a fractal noise texture on any surface. Controlled by `--af-noise`.

```html
<div class="aurora aurora-noise" style="--af-noise: 0.15;">
  Content with grain
</div>
```

### 7. `.aurora-blobs` — Organic Particle System

Volumetric blobs are injected dynamically by the JavaScript API when `blobs > 0`. Each blob is a radial-gradient circle with independent drift (spatial movement), morph (shape deformation), and desynchronized animation timing for non-repeating organic patterns.

```javascript
applyAurora(document.querySelector('.my-element'), {
  colors: [
    { color: '#a855f7' },
    { color: '#e879f9' },
    { color: '#2dd4bf' },
  ],
  blobs: 6,             // Number of particles (0–10)
  blobDrift: 1.5,        // Movement range multiplier
  blobDeformation: 1.2,  // Morphing speed multiplier
  blobChaos: 2,          // Temporal desynchronization multiplier
});
```

The blob system uses a deterministic PRNG (seeded per blob index), so positions and sizes remain stable across configuration updates — only changing when the blob count itself changes.

## Modifiers

### `.aurora-flow-y` — Vertical Flow

Add `.aurora-flow-y` to switch from horizontal to vertical flow (CSS-only):

```html
<div class="aurora aurora-flow-y">Vertical flow</div>
```

Or set it via JavaScript:

```javascript
applyAurora(el, { colors: [...], direction: 'y' });
```

### `.aurora-hover` — Hover Orchestration

Starts the effect invisible and reveals it with a smooth 700 ms fade-in on hover. Useful for buttons, cards, and interactive elements.

```html
<div class="aurora aurora-hover">
  <span>Hover to reveal</span>
</div>
```

The transition uses `@property`-registered `--af-intensity` for smooth interpolation. When `applyAurora()` detects the `.aurora-hover` class on an element, it skips writing `--af-intensity` inline so the CSS `:hover` rule can control it.

## JavaScript API

### `buildAuroraGradient({ colors, angle? })`

Returns a CSS `linear-gradient()` string with automatic cycle closure (first color repeated at 100 % for seamless tiling).

```javascript
const grad = buildAuroraGradient({
  colors: [{ color: '#ff0000' }, { color: '#0000ff' }],
  angle: 45,
});
// → "linear-gradient(45deg, #ff0000 0%, #0000ff 50%, #ff0000 100%)"
```

### `applyAurora(element, config)`

Writes all `--af-*` custom properties to an element. When `config.blobs > 0`, dynamically creates and injects blob DOM elements inside the target.

### `applyAuroraAll(target, config)`

Applies the same config to multiple elements. `target` can be a CSS selector string, an array, or a NodeList.

```javascript
applyAuroraAll('.card', { colors: [...], duration: '12s' });
```

### `removeAurora(element)`

Clears all `--af-*` properties from an element and removes injected blobs, reverting to `:root` defaults.

### `PRESETS`

Five built-in presets: `aurora`, `sunset`, `ocean`, `neon`, `monochrome`.

```javascript
import { applyAurora, PRESETS } from './aurora.js';
applyAurora(el, PRESETS.ocean);
```

## Configuration Object (`AuroraConfig`)

```javascript
{
  // ── Colors ──────────────────────────────────────────
  colors: [                    // Required: 2–8 color stops
    { color: '#7c3aed' },
    { color: '#e879f9', stop: 40 },       // custom position (%)
    { color: '#38bdf8', alpha: 0.6 },     // per-color transparency
  ],
  angle: 90,                  // Gradient angle (degrees)

  // ── Geometry ────────────────────────────────────────
  waveWidth: '200vw',         // Color cycle width
  direction: 'x',             // 'x' (horizontal) | 'y' (vertical)

  // ── Timing ──────────────────────────────────────────
  duration: '18s',            // Animation duration
  easing: 'linear',           // Timing function
  state: 'running',           // 'running' | 'paused'
  delay: '0s',                // Animation delay

  // ── Appearance ──────────────────────────────────────
  blur: '40px',               // Layer blur
  opacity: 0.7,               // Layer opacity (0–1)
  blend: 'screen',            // mix-blend-mode
  intensity: 1,               // Global multiplier (0–1)

  // ── Textures ────────────────────────────────────────
  noise: 0,                   // Grain intensity (0–1)
  noiseFreq: 0.85,            // Noise frequency
  noiseOctaves: 3,            // Noise octaves

  // ── Blobs (Particles) ──────────────────────────────
  blobs: 0,                   // Number of organic blobs (0–10)
  blobDrift: 1,               // Movement range multiplier
  blobDeformation: 1,         // Morphing speed multiplier
  blobChaos: 1,               // Temporal desynchronization multiplier
}
```

## Building

Aurora Fluid ships with a build script that generates minified production files:

```bash
npm install      # install esbuild (dev dependency)
npm run build    # generates aurora.min.css and aurora.min.js
```

| File | Original | Minified | Gzipped |
|---|---|---|---|
| `aurora.min.css` | 12.4 KB | 5.8 KB | **1.6 KB** |
| `aurora.min.js` | 13.0 KB | 4.6 KB | **2.0 KB** |
| **Total** | 25.4 KB | 10.4 KB | **3.6 KB** |

## Interactive Demo

Open `aurora-demo.html` in your browser for a live playground with controls for all properties, surfaces, presets, and the volumetric blob system.

## Performance

Aurora Fluid is engineered for 60 fps on modern hardware:

- **Single blur pass** — blob blur is applied once on the container, not per-particle
- **Strict containment** — `.aurora-blobs` uses `contain: strict` to isolate repaints
- **Conditional GPU layers** — `will-change` is only active when `prefers-reduced-motion` is not set
- **DOM reuse** — blob elements are recycled across configuration updates
- **Deterministic PRNG** — blob positions are stable; only count changes trigger repositioning
- **Compositor-thread animations** — all keyframes animate `transform` and `background-position`, avoiding main-thread layout thrashing

## Accessibility

Aurora Fluid respects `prefers-reduced-motion: reduce` — all animations (gradient flow, blob drift, blob morphing) are disabled when the user has this system preference enabled. GPU layers are also released in this mode.

## Browser Support

Works in all modern browsers that support:

- CSS Custom Properties
- `@property` (for animated custom properties)
- `mix-blend-mode`
- `mask-composite` / `-webkit-mask-composite`
- `backdrop-filter` (for glassmorphism demos)

## License

MIT
