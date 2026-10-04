/**
 * gl.ts - the one tiny WebGL helper every shader effect in components/fx
 * shares: a full-quad program on a canvas that tracks its element's size,
 * capped device pixel ratio, textures from image URLs, and a render loop
 * that only runs while the canvas is on screen.
 *
 * No dependency on three.js: the effects here are single full-screen
 * fragment shaders, which is exactly what award sites ship for waves,
 * ripples, gradients and image distortion.
 */

export type Uniform = number | [number, number] | [number, number, number]
  | [number, number, number, number] | WebGLTexture;

export type QuadGL = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  /** Set a uniform by name (float, vec2/3/4 or a texture). */
  set: (name: string, value: Uniform) => void;
  /** Load an image URL into a texture (cross-origin safe when allowed). */
  texture: (url: string) => Promise<{ tex: WebGLTexture; w: number; h: number }>;
  draw: () => void;
  /** Canvas size in device pixels. */
  size: () => [number, number];
  destroy: () => void;
};

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const s = gl.createShader(type);
  if (!s) throw new Error('shader');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(log ?? 'shader compile');
  }
  return s;
};

/** Create a full-quad program on `canvas`. Returns null when WebGL is
 *  unavailable, so every effect can fall back to plain DOM. */
export const createQuad = (
  canvas: HTMLCanvasElement,
  fragment: string,
  maxDpr = 1.75,
): QuadGL | null => {
  const gl = canvas.getContext('webgl', {
    premultipliedAlpha: true,
    alpha: true,
    antialias: false,
  });
  if (!gl) return null;
  let program: WebGLProgram;
  try {
    program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(
      program,
      compile(gl, gl.FRAGMENT_SHADER, `precision highp float;\n${fragment}`),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(program);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const units = new Map<string, number>();
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const set = (name: string, value: Uniform) => {
    const u = gl.getUniformLocation(program, name);
    if (!u) return;
    if (typeof value === 'number') gl.uniform1f(u, value);
    else if (Array.isArray(value)) {
      if (value.length === 2) gl.uniform2f(u, value[0], value[1]);
      else if (value.length === 3) gl.uniform3f(u, value[0], value[1], value[2]);
      else gl.uniform4f(u, value[0], value[1], value[2], value[3]);
    } else {
      let unit = units.get(name);
      if (unit === undefined) {
        unit = units.size;
        units.set(name, unit);
      }
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, value);
      gl.uniform1i(u, unit);
    }
  };

  const texture = (url: string) =>
    new Promise<{ tex: WebGLTexture; w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        const tex = gl.createTexture();
        if (!tex) return reject(new Error('texture'));
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        resolve({ tex, w: img.naturalWidth, h: img.naturalHeight });
      };
      img.onerror = () => reject(new Error('image load'));
      img.src = url;
    });

  return {
    gl,
    program,
    set,
    texture,
    draw: () => {
      resize();
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    size: () => [canvas.width, canvas.height],
    destroy: () => {
      ro.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
};

/** Run `frame(t)` every animation frame while `el` is on screen. */
export const loopWhileVisible = (
  el: Element,
  frame: (t: number) => void,
): (() => void) => {
  let raf = 0;
  let visible = false;
  const tick = (t: number) => {
    frame(t / 1000);
    if (visible) raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([entry]) => {
    const was = visible;
    visible = entry.isIntersecting;
    if (visible && !was) raf = requestAnimationFrame(tick);
    if (!visible) cancelAnimationFrame(raf);
  });
  io.observe(el);
  return () => {
    io.disconnect();
    cancelAnimationFrame(raf);
  };
};

/** A CSS color (any format the browser accepts, incl. hsl(var(--x))) as
 *  linear 0..1 RGB, read through the element so theme tokens resolve. */
export const cssColor = (el: Element, value: string): [number, number, number] => {
  const probe = document.createElement('span');
  probe.style.color = value;
  probe.style.display = 'none';
  el.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['0', '0', '0'];
  probe.remove();
  return [Number(rgb[0]) / 255, Number(rgb[1]) / 255, Number(rgb[2]) / 255];
};

/** Expo in-out, the award-site default for reveals and wipes. */
export const expoInOut = (x: number) =>
  x <= 0 ? 0 : x >= 1 ? 1
    : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
