# Aurora Fluid

A reusable animated gradient engine for the web. One CSS file, six surfaces, zero dependencies.

## Features

- 🎨 **6 surfaces** — background, text, border, mask, full-page, noise
- ⚡ **CSS-only** — works without JavaScript; JS helper is optional
- 🎛️ **Custom properties** — configure everything via `--af-*` variables
- 🎬 **Direction control** — horizontal or vertical flow
- ⏸️ **Play/pause** — animation state control via CSS or JS
- 📦 **Presets** — 5 built-in themes (aurora, sunset, ocean, neon, monochrome)
- ♿ **Accessible** — respects `prefers-reduced-motion`
- 🔷 **TypeScript** — full type definitions included

## Installation

### Copy

Download `aurora.css` and optionally `aurora.js` into your project.

### npm

```bash
npm install aurora-fluid
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/aurora-fluid/aurora.css">
<script type="module" src="https://unpkg.com/aurora-fluid/aurora.js"></script>
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
</script>
```

## Custom Properties (CSS API)

Override these on `:root` (global), on a class, or inline on any element.

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
| `--af-intensity` | `1` | Global multiplier (0-1) that scales blur & opacity |
| `--af-noise` | `0` | Grain texture intensity (0-1) |
| `--af-noise-freq` | `0.85` | Fractal noise base frequency (JS-configurable) |
| `--af-noise-octaves` | `3` | Fractal noise octaves (JS-configurable) |
| `--af-mask` | `none` | Mask silhouette for `.aurora-mask` |
| `--af-border-width` | `2px` | Animated border thickness |
| `--af-radius` | `1.25rem` | Border radius for `.aurora-border` |

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

## Direction Modifier

Add `.aurora-flow-y` to switch from horizontal to vertical flow (CSS-only):

```html
<div class="aurora aurora-flow-y">Vertical flow</div>
```

Or set it via JavaScript:

```javascript
applyAurora(el, { colors: [...], direction: 'y' });
```

## JavaScript API

### `buildAuroraGradient({ colors, angle? })`

Returns a CSS `linear-gradient()` string with automatic cycle closure.

```javascript
const grad = buildAuroraGradient({
  colors: [{ color: '#ff0000' }, { color: '#0000ff' }],
  angle: 45,
});
// → "linear-gradient(45deg, #ff0000 0%, #0000ff 50%, #ff0000 100%)"
```

### `applyAurora(element, config)`

Writes all `--af-*` custom properties to an element.

### `applyAuroraAll(target, config)`

Applies the same config to multiple elements. `target` can be a CSS selector string, an array, or a NodeList.

```javascript
applyAuroraAll('.card', { colors: [...], duration: '12s' });
```

### `removeAurora(element)`

Clears all `--af-*` properties from an element, reverting to `:root` defaults.

### `PRESETS`

Five built-in presets: `aurora`, `sunset`, `ocean`, `neon`, `monochrome`.

```javascript
import { applyAurora, PRESETS } from './aurora.js';
applyAurora(el, PRESETS.ocean);
```

## Configuration Object (`AuroraConfig`)

```javascript
{
  colors: [                    // Required: 2-8 color stops
    { color: '#7c3aed' },
    { color: '#e879f9', stop: 40 },       // custom position
    { color: '#38bdf8', alpha: 0.6 },     // per-color transparency
  ],
  angle: 90,                  // Gradient angle (degrees)
  waveWidth: '200vw',         // Color cycle width
  duration: '18s',            // Animation duration
  blur: '40px',               // Layer blur
  opacity: 0.7,               // Layer opacity (0-1)
  blend: 'screen',            // mix-blend-mode
  easing: 'linear',           // Timing function
  noise: 0,                   // Grain intensity (0-1)
  noiseFreq: 0.85,            // Noise frequency
  noiseOctaves: 3,            // Noise octaves
  state: 'running',           // 'running' | 'paused'
  delay: '0s',                // Animation delay
  direction: 'x',             // 'x' | 'y'
  intensity: 1,               // Global multiplier (0-1)
}
```

## Interactive Demo

Open `aurora-demo.html` in your browser for a live playground with all controls.

## Accessibility

Aurora Fluid respects `prefers-reduced-motion: reduce` — all animations are disabled when the user has this system preference enabled.

## Browser Support

Works in all modern browsers that support:
- CSS Custom Properties
- `mix-blend-mode`
- `mask-composite` / `-webkit-mask-composite`
- `backdrop-filter` (for glassmorphism demos)

## License

MIT
