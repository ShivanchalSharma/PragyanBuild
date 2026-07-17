import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Ambient "idea network" that fills its positioned parent and reacts to the
 * cursor. Drop it as the first child of a `relative` wrapper; render your real
 * content as a sibling with a higher z-index.
 *
 *   <div className="relative">
 *     <NeuralBackground />
 *     <div className="relative z-10"> ...content... </div>
 *   </div>
 */
export function NeuralBackground({
  className = "",
  count: countProp,
  speed = 1,
}: {
  className?: string;
  /** manual particle count — overrides the automatic area-based value */
  count?: number;
  /** velocity multiplier (1 = default, <1 = slower drift) */
  speed?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const raf = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];

    const primary = (a: number) => `oklch(0.62 0.16 275 / ${a})`; // indigo
    const accent = (a: number) => `oklch(0.82 0.16 80 / ${a})`; // amber

    // (re)size the canvas without disturbing existing nodes
    function resize() {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = wrap.offsetHeight;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // keep nodes inside the new bounds instead of regenerating them
      for (const n of nodes) {
        if (n.x > w) n.x = Math.random() * w;
        if (n.y > h) n.y = Math.random() * h;
      }
    }

    // create nodes ONCE, based on the initial area
    function seed() {
      const count =
        countProp ?? Math.max(45, Math.min(Math.floor((w * h) / 4000), 600));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.75 * speed,
        vy: (Math.random() - 0.5) * 0.75 * speed,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = 128;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        // gentle push away from the cursor
        const dxm = n.x - mx;
        const dym = n.y - my;
        const dm = Math.hypot(dxm, dym) || 1;
        if (mouse.current.active && dm < 150) {
          const f = ((150 - dm) / 150) * 0.9;
          n.x += (dxm / dm) * f;
          n.y += (dym / dm) * f;
        }

        // links between nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < linkDist) {
            ctx.strokeStyle = primary((1 - d / linkDist) * 0.16);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        // links to the cursor — the "reactive" bit
        if (mouse.current.active && dm < 185) {
          ctx.strokeStyle = accent((1 - dm / 185) * 0.5);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }

      // nodes on top
      for (const n of nodes) {
        const near = mouse.current.active && Math.hypot(n.x - mx, n.y - my) < 185;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? 2.6 : 1.7, 0, Math.PI * 2);
        ctx.fillStyle = near ? accent(0.95) : primary(0.7);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(frame);
    }

    resize();
    seed();
    frame();

    // Only react to meaningful size changes. Card animations nudge the section
    // height by a few px constantly — ignore those so nodes don't teleport.
    let lastW = w;
    let lastH = h;
    let debounce: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const rect = wrap.getBoundingClientRect();
        const newW = rect.width;
        const newH = wrap.offsetHeight;
        if (Math.abs(newW - lastW) < 2 && Math.abs(newH - lastH) < 120) return;
        lastW = newW;
        lastH = newH;
        resize();
      }, 150);
    });
    ro.observe(wrap);

    function onMove(e: MouseEvent) {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.current.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      mouse.current.x = x;
      mouse.current.y = y;
    }
    function onLeave() {
      mouse.current.active = false;
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(debounce);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* fade the mesh into the page top & bottom so section seams stay clean */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}