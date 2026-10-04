'use client';

/**
 * Live demos of components/fx for the /components gallery and the
 * /component/<name> storyboard routes. Sample imagery comes from a public
 * placeholder service that allows WebGL textures (CORS); real pages use
 * the business's own generated imagery.
 */
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  PointReveal,
  DistortImage,
  HorizontalScroll,
  Magnetic,
  ScrambleText,
  ScreenWave,
  ShaderGradient,
  StackCards,
  UISoundToggle,
  useUISound,
  WaveReveal,
} from '@/components/fx';

const img = (seed: string, w = 1600, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const WaveRevealDemo = () => {
  const shots = [img('clox-a'), img('clox-b'), img('clox-c')];
  const [i, setI] = React.useState(0);
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % shots.length);
      setN((v) => v + 1);
    }, 3200);
    return () => clearInterval(id);
  }, []);
  const prev = shots[(i + shots.length - 1) % shots.length];
  return (
    <div className="grid gap-4">
      <WaveReveal
        from={n === 0 ? shots[0] : prev}
        to={shots[i]}
        play={n}
        className="aspect-[16/9] w-full rounded-[var(--radius)]"
        alt="Product reveal"
      />
      <p className="k-eyebrow text-muted-foreground">
        The wave sweeps the next scene in every few seconds
      </p>
    </div>
  );
};

export const ScreenWaveDemo = () => {
  const [n, setN] = React.useState(0);
  const [label, setLabel] = React.useState('Chapter one');
  const sound = useUISound();
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center gap-6">
      <h2 className="k-h1">{label}</h2>
      <Button
        onClick={() => {
          sound.whoosh();
          setN((v) => v + 1);
        }}
      >
        Play the screen wave
      </Button>
      <ScreenWave
        play={n}
        onCovered={() =>
          setLabel((l) => (l === 'Chapter one' ? 'Chapter two' : 'Chapter one'))
        }
      />
    </div>
  );
};

export const HorizontalScrollDemo = () => (
  <div>
    <div className="flex h-[50vh] items-end px-6 pb-10 md:px-16">
      <h2 className="k-display max-w-3xl">Selected work, scroll down</h2>
    </div>
    <HorizontalScroll>
      {['north', 'tide', 'ember', 'glass', 'field', 'orbit'].map((s, i) => (
        <article key={s} className="w-[72vw] shrink-0 md:w-[34vw]">
          <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius)]">
            <img
              data-parallax
              src={img(s, 900, 1100)}
              alt=""
              className="h-full w-[124%] max-w-none object-cover"
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="k-h3 capitalize">{s}</h3>
            <span className="k-eyebrow text-muted-foreground">0{i + 1}</span>
          </div>
        </article>
      ))}
    </HorizontalScroll>
    <div className="h-[60vh]" />
  </div>
);

export const ShaderGradientDemo = () => (
  <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden rounded-[var(--radius)] p-10">
    <ShaderGradient className="absolute inset-0 -z-10" />
    <div className="max-w-xl">
      <ScrambleText text="LIVE BACKGROUND" className="k-eyebrow" />
      <h2 className="k-display mt-4">Light that moves with you</h2>
    </div>
  </section>
);

export const DistortImageDemo = () => (
  <div className="grid gap-6 md:grid-cols-3">
    {['mist', 'stone', 'river'].map((s) => (
      <div key={s} data-cursor="View">
        <DistortImage src={img(s, 900, 1100)} alt={s} className="aspect-[4/5] rounded-[var(--radius)]" />
        <p className="k-h3 mt-3 capitalize">{s}</p>
      </div>
    ))}
  </div>
);

export const InteractionDemo = () => {
  const sound = useUISound();
  return (
    <div className="flex flex-col items-start gap-8">
      <UISoundToggle />
      <div className="flex flex-wrap items-center gap-6">
        <Magnetic>
          <Button onPointerEnter={sound.tick} onClick={sound.press}>
            Magnetic button
          </Button>
        </Magnetic>
        <Button variant="outline" onClick={sound.chime}>
          Success chime
        </Button>
      </div>
      <nav className="flex gap-8">
        {['Work', 'Studio', 'Journal', 'Contact'].map((w) => (
          <a
            key={w}
            href="#"
            onPointerEnter={sound.tick}
            className="font-mono text-sm uppercase tracking-[0.18em]"
          >
            <ScrambleText text={w.toUpperCase()} onHover />
          </a>
        ))}
      </nav>
    </div>
  );
};

export const StackCardsDemo = () => (
  <div className="pb-[40vh]">
    <StackCards top={40}>
      {['Plan it', 'Build it', 'Launch it', 'Grow it'].map((t, i) => (
        <div
          key={t}
          className="flex h-[60vh] flex-col justify-between rounded-[var(--radius)] border border-border bg-card p-10"
        >
          <span className="k-eyebrow text-muted-foreground">Step 0{i + 1}</span>
          <h3 className="k-display">{t}</h3>
        </div>
      ))}
    </StackCards>
  </div>
);

export const PointRevealDemo = () => {
  const scene = React.useRef<HTMLDivElement>(null);
  const [show, setShow] = React.useState(0);
  const [hide, setHide] = React.useState(0);
  const [origin, setOrigin] = React.useState<[number, number]>([0.5, 0.5]);
  const [open, setOpen] = React.useState(false);
  const sound = useUISound();
  return (
    <div
      ref={scene}
      className="flex min-h-[80vh] cursor-pointer flex-col items-center justify-center gap-4 rounded-[var(--radius)] border border-border"
      onClick={(e) => {
        if (open) {
          setHide((v) => v + 1);
          setOpen(false);
          return;
        }
        setOrigin([e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight]);
        setShow((v) => v + 1);
        setOpen(true);
      }}
    >
      <p className="k-h2">Click anywhere</p>
      <p className="text-muted-foreground">The product opens from where you clicked. Click again to close.</p>
      <PointReveal
        picture={img('clox-product', 1600, 1000)}
        show={show}
        hide={hide}
        origin={origin}
        shake={scene}
        onWhoosh={sound.whoosh}
      />
    </div>
  );
};
