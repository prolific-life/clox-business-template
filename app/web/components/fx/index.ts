// components/fx - the effects layer that makes a site feel made, not
// templated: WebGL shaders, scroll-driven motion, cursor craft and UI
// sound. Every piece degrades to plain DOM on touch, without WebGL and
// under prefers-reduced-motion. See design/library/EFFECTS.md for when to
// use which, and /components for every piece live.
export { WaveReveal, ScreenWave, PointReveal } from './wave-reveal';
export { HorizontalScroll } from './horizontal-scroll';
export { ShaderGradient } from './shader-gradient';
export { DistortImage } from './distort-image';
export { Magnetic, Cursor, ScrambleText, StackCards } from './interaction';
export { useUISound, UISoundToggle, setUISound } from './ui-sound';
