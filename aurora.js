/**
 * AURORA FLUID — Configuration Helper
 * ---------------------------------------------------------
 * Does not generate HTML or animation by itself: it calculates
 * the `linear-gradient(...)` string from your color list and
 * writes it, along with the rest of the parameters, as custom
 * properties (--af-*) on the element you pass. The CSS file
 * (aurora.css) is what actually animates and paints.
 *
 * @typedef {Object} AuroraColorStop
 * @property {string}  color   - Color in any valid CSS format (hex, rgb, hsl, oklch...)
 * @property {number}  [stop]  - Position 0-100 (%) of the color in the gradient.
 *                               If omitted, colors are distributed evenly.
 *                               Repeating a color with different positions increases
 *                               its visual "presence" in the cycle.
 * @property {number}  [alpha] - 0-1, individual transparency for THIS color
 *                               (uses color-mix, independent of --af-opacity global)
 *
 * @typedef {Object} AuroraConfig
 * @property {AuroraColorStop[]} colors       - 2-8 colors recommended
 * @property {number}  [angle=90]             - Gradient angle in degrees
 * @property {string}  [waveWidth="200vw"]    - Color cycle width (wave amplitude)
 * @property {string}  [duration="18s"]       - Duration of one full animation cycle
 * @property {string}  [blur="40px"]          - Layer blur (inverse sharpness)
 * @property {number}  [opacity=0.7]          - Global layer opacity (0-1)
 * @property {string}  [blend="screen"]       - mix-blend-mode
 * @property {string}  [easing="linear"]      - Animation timing-function
 * @property {number}  [noise=0]              - Grain intensity (0-1, requires .aurora-noise class)
 * @property {number}  [noiseFreq=0.85]       - Fractal noise base frequency
 * @property {number}  [noiseOctaves=3]       - Fractal noise octaves
 * @property {string}  [state="running"]      - "running" | "paused"
 * @property {string}  [delay="0s"]           - Animation delay (for staggering)
 * @property {string}  [direction="x"]        - "x" | "y" — animation axis
 * @property {number}  [intensity=1]          - Global effect multiplier (0-1)
 * @property {number}  [blobs=0]              - Number of volumetric blobs to inject (0-10)
 * @property {number}  [blobDeformation=1]    - Morphing speed multiplier
 * @property {number}  [blobDrift=1]          - Spatial movement multiplier
 * @property {number}  [blobChaos=1]          - Temporal desynchronization multiplier
 * @property {number}  [blobSize=1]           - Scale multiplier for volumetric blobs
 */

/**
 * Resolves a single color stop, applying individual alpha
 * via color-mix if the stop specifies an alpha value.
 * @param {AuroraColorStop} c
 * @returns {string} CSS color value
 */
function resolveColor(c) {
  return c.alpha != null
    ? `color-mix(in srgb, ${c.color} ${Math.round(c.alpha * 100)}%, transparent)`
    : c.color;
}

/**
 * OPT-3: Deterministic PRNG (mulberry32) — produces the same
 * sequence given the same seed, so blob positions are stable
 * across refresh() calls when only unrelated params change.
 * @param {number} seed
 * @returns {() => number} A function returning 0-1
 */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// OPT-4: Module-level constants — prime-ish durations to prevent visual looping
const DRIFT_DURATIONS = [30, 34, 27, 36, 31, 35, 29, 37, 23, 41];
const MORPH_DURATIONS = [22, 25, 20, 26, 28, 19, 23, 31, 17, 29];

/**
 * Builds the linear-gradient CSS string from a color list.
 * Closes the cycle by repeating the first color at 100% so that
 * the `repeat-x` animation tiles seamlessly (no visible seam).
 * @param {{colors: AuroraColorStop[], angle?: number}} params
 * @returns {string} A complete CSS linear-gradient() value
 */
export function buildAuroraGradient({ colors, angle = 90 }) {
  if (!colors || colors.length < 2) {
    throw new Error("aurora: at least 2 colors are required");
  }

  const n = colors.length;
  const stops = colors.map((c, i) => {
    const pos = c.stop ?? Math.round((i / n) * 100);
    return `${resolveColor(c)} ${pos}%`;
  });

  // Cycle closure: gradient must end with the same color it started
  // with so the horizontal repeat tiles without a visible color jump.
  // We recalculate from the original object (not from the formatted
  // string) to correctly handle color-mix() values with spaces.
  stops.push(`${resolveColor(colors[0])} 100%`);

  return `linear-gradient(${angle}deg, ${stops.join(", ")})`;
}

/**
 * Builds an SVG data-URI for the fractal noise texture.
 * Used internally to dynamically update noise parameters.
 * @param {number} freq     - feTurbulence baseFrequency
 * @param {number} octaves  - feTurbulence numOctaves
 * @returns {string} CSS url() value with encoded SVG
 */
function buildNoiseBg(freq, octaves) {
  return `url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22${freq}%22 numOctaves=%22${octaves}%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')`;
}

/**
 * Applies a complete configuration to a DOM element by writing
 * each parameter as a custom property (--af-*).
 * @param {HTMLElement} el      - Target element (often document.documentElement for global)
 * @param {AuroraConfig} config - Configuration object
 */
export function applyAurora(el, config) {
  let { angle } = config;
  const {
    colors,
    waveWidth = "200vw",
    duration = "18s",
    blur = "40px",
    opacity = 0.7,
    blend = "screen",
    easing = "linear",
    noise = 0,
    noiseFreq = 0.85,
    noiseOctaves = 3,
    state = "running",
    delay = "0s",
    direction = "x",
    intensity = 1,
    blobs = 0,
    blobDeformation = 1,
    blobDrift = 1,
    blobChaos = 1,
    blobSize = 1,
  } = config;

  if (angle === undefined) {
    angle = direction === "y" ? 180 : 90;
  }

  // Core properties
  el.style.setProperty("--af-gradient", buildAuroraGradient({ colors, angle }));
  el.style.setProperty("--af-wave-width", waveWidth);
  el.style.setProperty("--af-duration", duration);
  el.style.setProperty("--af-blur", blur);
  el.style.setProperty("--af-opacity", String(opacity));
  el.style.setProperty("--af-blend", blend);
  el.style.setProperty("--af-easing", easing);
  el.style.setProperty("--af-noise", String(noise));
  el.style.setProperty("--af-state", state);
  el.style.setProperty("--af-delay", delay);

  // BUG FIX: Skip inline intensity on hover-controlled elements
  // so the CSS :hover rule can drive --af-intensity via the cascade.
  if (!el.classList.contains("aurora-hover")) {
    el.style.setProperty("--af-intensity", String(intensity));
  }

  // Direction: set internal computed properties that the CSS reads
  if (direction === "y") {
    el.style.setProperty("--_af-bg-size", `100% ${waveWidth}`);
    el.style.setProperty("--_af-bg-repeat", "repeat-y");
    el.style.setProperty("--_af-anim", "aurora-flow-y");
  } else {
    el.style.setProperty("--_af-bg-size", `${waveWidth} 100%`);
    el.style.setProperty("--_af-bg-repeat", "repeat-x");
    el.style.setProperty("--_af-anim", "aurora-flow-x");
  }

  // Noise: regenerate SVG data-URI only when non-default
  if (noiseFreq !== 0.85 || noiseOctaves !== 3) {
    el.style.setProperty("--_af-noise-bg", buildNoiseBg(noiseFreq, noiseOctaves));
  } else {
    el.style.removeProperty("--_af-noise-bg");
  }

  // Blobs Generation (OPT-2: reuse existing DOM nodes)
  if (blobs > 0) {
    let blobsWrapper = el.querySelector(".aurora-blobs");
    if (!blobsWrapper) {
      blobsWrapper = document.createElement("div");
      blobsWrapper.className = "aurora-blobs";
      el.appendChild(blobsWrapper);
    }

    const existing = blobsWrapper.children;

    // Remove excess blobs
    while (existing.length > blobs) {
      blobsWrapper.removeChild(existing[existing.length - 1]);
    }

    for (let i = 0; i < blobs; i++) {
      // OPT-3: Deterministic random per blob index
      const rng = mulberry32(i * 2654435761); // golden-ratio hash spread

      let blob = existing[i];
      const isNew = !blob;

      if (isNew) {
        blob = document.createElement("div");
        blob.className = "aurora-blob";
        blob.dataset.afSeed = String(i);
      }

      // Only reposition if this is a freshly created blob
      if (isNew) {
        // Select core color (wrap around if more blobs than colors)
        const cStop = colors[i % colors.length];
        const coreColor = resolveColor(cStop);
        const cx = 35 + rng() * 30;
        const cy = 35 + rng() * 30;
        blob.style.background = `radial-gradient(circle at ${cx}% ${cy}%, ${coreColor}, transparent 70%)`;

        // Deterministic size between 35 and 65 (scaled by cqmax)
        const size = 35 + rng() * 30;
        blob.style.width = `calc(${size}cqmax * var(--af-blob-size, 1))`;
        // aspect-ratio: 1/1 in CSS automatically handles height

        // Deterministic spread across the container
        blob.style.top = `${-10 + rng() * 60}%`;
        blob.style.left = `${-10 + rng() * 60}%`;

        // Select animations
        const driftId = (i % 3) + 1;
        const morphId = ((i + 1) % 3) + 1;

        const dDur = DRIFT_DURATIONS[i % DRIFT_DURATIONS.length];
        const mDur = MORPH_DURATIONS[i % MORPH_DURATIONS.length] / Math.max(0.1, blobDeformation);

        // Chaos offsets (deterministic)
        const driftDelay = -(rng() * 30 * blobChaos);
        const morphDelay = -(rng() * 30 * blobChaos);

        blob.style.animation = `
          aurora-drift-${driftId} ${dDur}s ease-in-out infinite ${i % 2 === 0 ? "alternate" : "alternate-reverse"},
          aurora-morph-${morphId} ${mDur}s ease-in-out infinite alternate
        `;
        blob.style.animationDelay = `${driftDelay}s, ${morphDelay}s`;
      }

      // Always update these (they depend on live slider values)
      blob.style.animationPlayState = state;
      blob.style.setProperty("--af-drift", String(blobDrift));
      blob.style.setProperty("--af-blob-size", String(blobSize));

      if (isNew) {
        blobsWrapper.appendChild(blob);
      }
    }
  } else {
    // Remove blobs wrapper if it exists and blobs = 0
    const existing = el.querySelector(".aurora-blobs");
    if (existing) existing.remove();
  }
}

/**
 * Shortcut: applies the same configuration to multiple elements
 * (or to all elements matching a CSS selector).
 * @param {string | HTMLElement[] | NodeListOf<HTMLElement>} target
 * @param {AuroraConfig} config
 */
export function applyAuroraAll(target, config) {
  const elements =
    typeof target === "string" ? document.querySelectorAll(target) : target;
  elements.forEach((el) => applyAurora(el, config));
}

/**
 * Removes all --af-* custom properties from an element,
 * reverting it to the :root defaults. Also removes the
 * direction modifier class and any injected blobs.
 * @param {HTMLElement} el
 */
export function removeAurora(el) {
  const props = [
    "--af-gradient", "--af-wave-width", "--af-duration", "--af-blur",
    "--af-opacity", "--af-blend", "--af-easing", "--af-noise",
    "--af-state", "--af-delay", "--af-intensity",
    "--_af-bg-size", "--_af-bg-repeat", "--_af-anim", "--_af-noise-bg",
  ];
  props.forEach((prop) => el.style.removeProperty(prop));
  el.classList.remove("aurora-flow-y");

  const existingBlobs = el.querySelector(".aurora-blobs");
  if (existingBlobs) existingBlobs.remove();
}

/**
 * Ready-to-use configuration presets.
 * Usage: applyAurora(el, PRESETS.sunset);
 * @type {Record<string, AuroraConfig>}
 */
export const PRESETS = {
  aurora: {
    colors: [
      { color: "#7c3aed" },
      { color: "#a855f7" },
      { color: "#e879f9" },
      { color: "#2dd4bf" },
      { color: "#38bdf8" },
      { color: "#f472b6" },
    ],
    duration: "18s",
    blur: "40px",
    opacity: 0.7,
    blend: "screen",
  },
  sunset: {
    colors: [
      { color: "#f97316" },
      { color: "#ef4444" },
      { color: "#ec4899" },
      { color: "#f59e0b" },
      { color: "#fbbf24" },
      { color: "#fb923c" },
    ],
    duration: "22s",
    blur: "50px",
    opacity: 0.8,
    blend: "overlay",
  },
  ocean: {
    colors: [
      { color: "#0ea5e9" },
      { color: "#06b6d4" },
      { color: "#14b8a6" },
      { color: "#3b82f6" },
      { color: "#6366f1" },
      { color: "#0284c7" },
    ],
    duration: "30s",
    blur: "70px",
    opacity: 0.6,
    blend: "screen",
  },
  neon: {
    colors: [
      { color: "#00ff87" },
      { color: "#60efff" },
      { color: "#ff00e5" },
      { color: "#ffd700" },
      { color: "#7df9ff" },
      { color: "#ff6ec7" },
    ],
    duration: "10s",
    blur: "30px",
    opacity: 0.9,
    blend: "color-dodge",
  },
  monochrome: {
    colors: [
      { color: "#e2e8f0" },
      { color: "#94a3b8" },
      { color: "#475569" },
      { color: "#cbd5e1" },
      { color: "#64748b" },
      { color: "#f1f5f9" },
    ],
    duration: "25s",
    blur: "60px",
    opacity: 0.5,
    blend: "soft-light",
  },
};

/* ---------------------------------------------------------
   Usage example:

   import { applyAurora, PRESETS, removeAurora } from "./aurora.js";

   // Custom configuration
   applyAurora(document.querySelector(".my-card"), {
     colors: [
       { color: "#7c3aed" },
       { color: "#e879f9" },
       { color: "#38bdf8", alpha: 0.6 },
     ],
     duration: "12s",
     blur: "60px",
     blend: "screen",
   });

   // Using a preset
   applyAurora(document.querySelector(".hero"), PRESETS.sunset);

   // Cleanup
   removeAurora(document.querySelector(".my-card"));
--------------------------------------------------------- */
