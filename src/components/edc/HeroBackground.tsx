import { useEffect, useRef } from "react";

const SKETCH_MARKS = [
  { top: "18%", left: "10%", rotate: -8 },
  { top: "70%", left: "84%", rotate: 6 },
  { top: "28%", left: "88%", rotate: -4 },
];

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.3 });
  const pos = useRef({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      target.current.x = (e.clientX - rect.left) / rect.width;
      target.current.y = (e.clientY - rect.top) / rect.height;
    }
    el.addEventListener("mousemove", onMove);

    let raf: number;
    function tick() {
      pos.current.x += (target.current.x - pos.current.x) * 0.07;
      pos.current.y += (target.current.y - pos.current.y) * 0.07;
      const rect = el!.getBoundingClientRect();
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x * rect.width - 350}px, ${pos.current.y * rect.height - 350}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient mood */}
      <div className="absolute inset-0 bg-hero-mesh" />
      <div
        className="absolute inset-0 bg-hero-mesh animate-mesh opacity-40"
        style={{ transform: "scale(1.3)" }}
      />

      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-grid" />

      {/* Grain texture */}
      <div className="absolute inset-0 bg-grain" />

      {/* Sparse sketch annotations — like a founder marking up the blueprint */}
      {SKETCH_MARKS.map((m, i) => (
        <svg
          key={i}
          className="absolute w-16 h-16 text-accent/25"
          style={{ top: m.top, left: m.left, transform: `rotate(${m.rotate}deg)` }}
          viewBox="0 0 64 64"
          fill="none"
        >
          {i === 0 && (
            <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
          )}
          {i === 1 && (
            <>
              <line x1="4" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
              <path d="M46 26 L54 32 L46 38" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </>
          )}
          {i === 2 && (
            <path d="M6 40 Q 20 8, 34 30 T 58 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
          )}
        </svg>
      ))}

      {/* Cursor-reactive glow */}
      <div
        ref={glowRef}
        className="absolute w-[700px] h-[700px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.16 275 / 0.35), oklch(0.82 0.16 80 / 0.12) 40%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}