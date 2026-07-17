import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  freq: number;
  amp: number;
  amber: boolean;
  alpha: number;
}

const CURSOR_R = 150;

/**
 * Rising embers: soft glowing bubbles drift upward with a gentle sway and part
 * around the cursor — a quiet "growth / momentum" ambience for the hero.
 * Drop it as the first child of a `relative` wrapper; content sits above it.
 */
export function RisingEmbers({
  className = "",
  count: countProp,
  speed = 1,
}: {
  className?: string;
  count?: number;
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
    let bubbles: Bubble[] = [];

    const INDIGO = "0.66 0.16 275";
    const AMBER = "0.82 0.16 80";

    function make(fromBottom: boolean): Bubble {
      const r = 2 + Math.random() * 5;
      return {
        x: Math.random() * w,
        y: fromBottom ? h + r + Math.random() * h * 0.4 : Math.random() * h,
        r,
        vy: (0.5 + Math.random() * 0.8) * speed,
        phase: Math.random() * Math.PI * 2,
        freq: 0.4 + Math.random() * 0.8,
        amp: 6 + Math.random() * 16,
        amber: Math.random() < 0.28,
        alpha: 0.25 + Math.random() * 0.45,
      };
    }

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
      for (const b of bubbles) if (b.x > w) b.x = Math.random() * w;
    }

    function seed() {
      const count =
        countProp ?? Math.max(40, Math.min(Math.floor((w * h) / 10000), 250));
      bubbles = Array.from({ length: count }, () => make(false));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const active = mouse.current.active;

      for (const b of bubbles) {
        b.y -= b.vy;
        b.x += Math.sin(t * b.freq + b.phase) * b.amp * 0.02;

        if (active) {
          const dx = b.x - mx;
          const dy = b.y - my;
          const d = Math.hypot(dx, dy) || 1;
          if (d < CURSOR_R) {
            const push = ((CURSOR_R - d) / CURSOR_R) * 1.6;
            b.x += (dx / d) * push;
            b.y += (dy / d) * push;
          }
        }

        // respawn at the bottom once it floats past the top
        if (b.y < -b.r * 4) Object.assign(b, make(true));

        const base = b.amber ? AMBER : INDIGO;
        // soft glow
        const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 4);
        glow.addColorStop(0, `oklch(${base} / ${b.alpha * 0.5})`);
        glow.addColorStop(1, `oklch(${base} / 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 4, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(${base} / ${b.alpha})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(frame);
    }

    function drawStatic() {
      resize();
      seed();
      for (const b of bubbles) {
        const base = b.amber ? AMBER : INDIGO;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(${base} / ${b.alpha})`;
        ctx.fill();
      }
    }

    if (reduce) {
      drawStatic();
    } else {
      resize();
      seed();
      frame();
    }

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
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}