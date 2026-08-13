export interface AuroraColorStop {
  /** Color in any valid CSS format (hex, rgb, hsl, oklch...) */
  color: string;
  /** Position 0-100 (%) of the color in the gradient. Auto-distributed if omitted. */
  stop?: number;
  /** Individual transparency 0-1 for this color (uses color-mix). */
  alpha?: number;
}

export interface AuroraConfig {
  /** Array of 2-8 color stops. */
  colors: AuroraColorStop[];
  /** Gradient angle in degrees. @default 90 */
  angle?: number;
  /** Color cycle width (wave amplitude). @default "200vw" */
  waveWidth?: string;
  /** Duration of one full animation cycle. @default "18s" */
  duration?: string;
  /** Gaussian blur of the animated layer. @default "40px" */
  blur?: string;
  /** Global layer opacity (0-1). @default 0.7 */
  opacity?: number;
  /** CSS mix-blend-mode. @default "screen" */
  blend?: string;
  /** Animation timing-function. @default "linear" */
  easing?: string;
  /** Grain intensity (0-1). Requires .aurora-noise class. @default 0 */
  noise?: number;
  /** Fractal noise base frequency. @default 0.85 */
  noiseFreq?: number;
  /** Fractal noise octaves. @default 3 */
  noiseOctaves?: number;
  /** Animation play state. @default "running" */
  state?: "running" | "paused";
  /** Animation delay for staggering. @default "0s" */
  delay?: string;
  /** Animation axis. @default "x" */
  direction?: "x" | "y";
  /** Global effect multiplier (0-1). @default 1 */
  intensity?: number;
}

/**
 * Builds a linear-gradient CSS string from a color list.
 * Automatically closes the cycle for seamless tiling.
 */
export declare function buildAuroraGradient(params: {
  colors: AuroraColorStop[];
  angle?: number;
}): string;

/**
 * Applies a complete Aurora configuration to a DOM element
 * by writing custom properties (--af-*).
 */
export declare function applyAurora(
  el: HTMLElement,
  config: AuroraConfig
): void;

/**
 * Applies the same configuration to multiple elements
 * or all elements matching a CSS selector.
 */
export declare function applyAuroraAll(
  target: string | HTMLElement[] | NodeListOf<HTMLElement>,
  config: AuroraConfig
): void;

/**
 * Removes all --af-* custom properties from an element,
 * reverting to :root defaults.
 */
export declare function removeAurora(el: HTMLElement): void;

/** Ready-to-use configuration presets. */
export declare const PRESETS: Record<string, AuroraConfig>;
