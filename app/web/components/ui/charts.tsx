'use client';

import * as React from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Dependency-free SVG charts that draw in when scrolled into view and
 * color from the theme: AreaChart (1-3 series), BarChart, Sparkline,
 * Donut. Stroke width, fills and grid follow the design system's chart
 * notes; keep charts quiet (hairline grid, no chart junk).
 */

const SERIES = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--foreground) / 0.45)',
];

/** Monotone-ish smooth path through points (Catmull-Rom to Bezier). */
const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
};

const useDraw = () => {
  const ref = React.useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const reduce = useReducedMotion();
  return { ref, drawn: inView || Boolean(reduce) };
};

type AreaChartProps = {
  series: { name: string; points: number[] }[];
  labels?: string[];
  height?: number;
  className?: string;
  /** Screen-reader summary of what the chart shows. */
  summary: string;
};

export const AreaChart = ({
  series,
  labels = [],
  height = 240,
  className,
  summary,
}: AreaChartProps) => {
  const { ref, drawn } = useDraw();
  const id = React.useId().replace(/:/g, '');
  const W = 640;
  const H = height;
  const pad = { t: 12, r: 8, b: labels.length ? 28 : 8, l: 8 };
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all) * 1.12;
  const min = Math.min(0, ...all);
  const n = Math.max(...series.map((s) => s.points.length));
  const x = (i: number) => pad.l + (i / Math.max(1, n - 1)) * (W - pad.l - pad.r);
  const y = (v: number) =>
    pad.t + (1 - (v - min) / (max - min || 1)) * (H - pad.t - pad.b);
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className={cn('w-full', className)}
      role="img"
      aria-label={summary}
      preserveAspectRatio="none"
      style={{ height }}
    >
      <defs>
        {series.map((_, si) => (
          <linearGradient key={si} id={`${id}-g${si}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SERIES[si % 3]} stopOpacity="0.28" />
            <stop offset="100%" stopColor={SERIES[si % 3]} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + f * (H - pad.t - pad.b)}
          y2={pad.t + f * (H - pad.t - pad.b)}
          stroke="hsl(var(--foreground) / 0.08)"
          strokeDasharray="2 4"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <g
        style={{
          clipPath: drawn ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
          transition: 'clip-path 1600ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {series.map((s, si) => {
          const pts = s.points.map((v, i) => [x(i), y(v)] as [number, number]);
          const line = smoothPath(pts);
          const area = `${line} L${x(pts.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
          return (
            <g key={s.name}>
              {si === 0 ? <path d={area} fill={`url(#${id}-g${si})`} /> : null}
              <path
                d={line}
                fill="none"
                stroke={SERIES[si % 3]}
                strokeWidth={si === 0 ? 2.25 : 1.5}
                strokeDasharray={si === 0 ? undefined : '4 4'}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>
      {labels.map((l, i) =>
        i % Math.ceil(labels.length / 6) === 0 ? (
          <text
            key={l + i}
            x={x(i)}
            y={H - 8}
            fontSize="11"
            fill="hsl(var(--muted-foreground))"
            textAnchor={i === 0 ? 'start' : 'middle'}
            style={{ fontFamily: 'var(--k-font-mono)' }}
          >
            {l}
          </text>
        ) : null,
      )}
    </svg>
  );
};

export const BarChart = ({
  values,
  labels = [],
  height = 180,
  className,
  summary,
}: {
  values: number[];
  labels?: string[];
  height?: number;
  className?: string;
  summary: string;
}) => {
  const { ref, drawn } = useDraw();
  const max = Math.max(...values) * 1.08 || 1;
  const W = 640;
  const gap = 10;
  const bw = (W - gap * (values.length - 1)) / values.length;
  const bottom = labels.length ? height - 22 : height;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${height}`}
      className={cn('w-full', className)}
      role="img"
      aria-label={summary}
      preserveAspectRatio="none"
      style={{ height }}
    >
      {values.map((v, i) => {
        const h = (v / max) * bottom;
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={bottom - (drawn ? h : 0)}
            width={bw}
            height={drawn ? h : 0}
            rx={Math.min(6, bw / 3)}
            fill={
              i === values.length - 1
                ? 'hsl(var(--primary))'
                : 'hsl(var(--foreground) / 0.12)'
            }
            style={{
              transition: `all 900ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms`,
            }}
          />
        );
      })}
      {labels.map((l, i) => (
        <text
          key={l + i}
          x={i * (bw + gap) + bw / 2}
          y={height - 4}
          fontSize="11"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          style={{ fontFamily: 'var(--k-font-mono)' }}
        >
          {l}
        </text>
      ))}
    </svg>
  );
};

export const Sparkline = ({
  points,
  up = true,
  className,
}: {
  points: number[];
  up?: boolean;
  className?: string;
}) => {
  const W = 120;
  const H = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const pts = points.map(
    (v, i) =>
      [
        (i / Math.max(1, points.length - 1)) * W,
        3 + (1 - (v - min) / (max - min || 1)) * (H - 6),
      ] as [number, number],
  );
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn('h-9 w-28', className)}
      aria-hidden="true"
    >
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={up ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Donut = ({
  value,
  label,
  size = 120,
  className,
}: {
  value: number;
  label: string;
  size?: number;
  className?: string;
}) => {
  const { ref, drawn } = useDraw();
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${label}: ${pct}%`}
    >
      <circle cx="50" cy="50" r={r} fill="none" stroke="hsl(var(--foreground) / 0.08)" strokeWidth="8" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={drawn ? c * (1 - pct / 100) : c}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1400ms cubic-bezier(0.16,1,0.3,1)' }}
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        fontSize="18"
        fill="hsl(var(--foreground))"
        style={{ fontFamily: 'var(--k-font-display)', fontWeight: 500 }}
      >
        {pct}%
      </text>
    </svg>
  );
};
