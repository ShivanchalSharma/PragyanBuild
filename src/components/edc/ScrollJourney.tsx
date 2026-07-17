import { useEffect, useRef } from "react";

/**
 * A bold "founder journey" line that snakes down through the See-it section —
 * leaning toward each zig-zag card, weaving behind them, throwing in a couple of
 * loops — and draws itself as you scroll (retracts on scroll up). It generates
 * its path from the section's real pixel size so loops stay round at any width.
 *
 * Render it inside a `relative` section, as a sibling BEHIND the content
 * (content should sit in a `relative z-10` wrapper).
 */

// waypoints as fractions of the section (x, y). `loop` inserts a round loop.
// card sides in SeeItInAction: row0 left, row1 right, row2 left, row3 right.
const WAYPOINTS: { x: number; y: number; loop?: number }[] = [
  { x: 0.0, y: 0.0 }, // start — far LEFT edge of the screen
  { x: 0.15, y: 0.17 }, // toward card 1 (left)
  { x: 0.8, y: 0.24 },
  { x: 0.5, y: 0.28 },
  { x: 0.1, y: 0.34}, // loop in the gap
  { x: 0.4, y: 0.42}, // card 2 (right)
  { x: 0.25, y: 0.52 }, // cross back
  { x: 0.77, y: 0.63 }, // card 3 (left)
  { x: 0.15, y: 0.75}, // loop in the gap
  { x: 0.77, y: 0.86 }, // card 4 (right)
  { x: 1.0, y: 1.0 }, // end — far RIGHT edge of the screen
];

function buildPoints(W: number, H: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < WAYPOINTS.length; i++) {
    const wp = WAYPOINTS[i];
    const cx = wp.x * W;
    const cy = wp.y * H;
    if (wp.loop) {
      const r = wp.loop * W;
      // travel direction through the loop
      const prev = WAYPOINTS[i - 1] || wp;
      const next = WAYPOINTS[i + 1] || wp;
      let dx = (next.x - prev.x) * W;
      let dy = (next.y - prev.y) * H;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl;
      dy /= dl;
      // put the loop centre one radius to the side, so the ring is TANGENT to
      // the line at the anchor point → it curls off and rejoins with no cusp
      const px = -dy;
      const py = dx;
      const Cx = cx + px * r;
      const Cy = cy + py * r;
      const a0 = Math.atan2(cy - Cy, cx - Cx); // anchor sits on the ring
      const N = 28;
      for (let k = 0; k < N; k++) {
        const a = a0 + Math.PI * 2 * (k / N);
        pts.push([Cx + Math.cos(a) * r, Cy + Math.sin(a) * r]);
      }
    } else {
      pts.push([cx, cy]);
    }
  }
  return pts;
}

// smooth the points into a single cubic-bezier path (Catmull-Rom → Bézier)
function toPath(p: [number, number][]): string {
  if (p.length < 2) return "";
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export function ScrollJourney({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!wrap || !svg || !path) return;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    function rebuild() {
      const W = wrap!.clientWidth;
      const H = wrap!.clientHeight;
      if (!W || !H) return;
      svg!.setAttribute("viewBox", `0 0 ${W} ${H}`);
      path!.setAttribute("d", toPath(buildPoints(W, H)));
      draw();
    }

    function draw() {
      raf.current = 0;
      const rect = wrap!.getBoundingClientRect();
      const vh = window.innerHeight;
      // Spread the draw across a longer scroll distance so it tracks the scroll
      // gradually instead of finishing early. Bigger DRAW_SPAN = slower drawing.
      const DRAW_SPAN = rect.height + vh * 0.4;
      const progress = clamp((vh - rect.top) / DRAW_SPAN);
      path!.style.strokeDashoffset = String(1 - progress);
    }

    function onScroll() {
      if (!raf.current) raf.current = requestAnimationFrame(draw);
    }

    rebuild();

    // rebuild on real size changes (ignore the small wobble from card animations)
    let lastW = wrap.clientWidth;
    let lastH = wrap.clientHeight;
    let debounce: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const W = wrap.clientWidth;
        const H = wrap.clientHeight;
        if (Math.abs(W - lastW) < 2 && Math.abs(H - lastH) < 120) return;
        lastW = W;
        lastH = H;
        rebuild();
      }, 150);
    });
    ro.observe(wrap);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(debounce);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen ${className}`}
    >
      <svg
        ref={svgRef}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="journeyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.16 275)" stopOpacity="0.9" />
            <stop offset="55%" stopColor="oklch(0.62 0.16 275)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="oklch(0.82 0.16 80)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d=""
          fill="none"
          stroke="url(#journeyGrad)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        />
      </svg>
    </div>
  );
}