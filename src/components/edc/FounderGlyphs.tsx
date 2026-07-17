import {
  Rocket,
  Lightbulb,
  BookOpen,
  BrainCircuit,
  LineChart,
  Target,
  Handshake,
  Network,
  Trophy,
  IndianRupee,
  GraduationCap,
  Coins,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Ambient, entrepreneurship-themed line icons that drift slowly behind the
 * content. Purely decorative. Uses lucide icons so they're crisp + recognizable.
 * Sits above the animated background and below the real content.
 */

type Glyph = {
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: number;
  opacity: number;
  Icon: LucideIcon;
};

const GLYPHS: Glyph[] = [
  { top: "12%", left: "8%", size: 46, rotate: -12, delay: 0, opacity: 0.4, Icon: Rocket },
  { top: "12%", left: "88%", size: 40, rotate: 10, delay: 1.4, opacity: 0.36, Icon: Lightbulb },
  { top: "15%", left: "68%", size: 40, rotate: -6, delay: 1.6, opacity: 0.32, Icon: GraduationCap },
  { top: "8%", left: "44%", size: 36, rotate: -6, delay: 2.6, opacity: 0.4, Icon: BookOpen },
  { top: "20%", left: "30%", size: 38, rotate: -10, delay: 2.2, opacity: 0.4, Icon: Trophy },
  { top: "40%", left: "4%", size: 48, rotate: -4, delay: 0.8, opacity: 0.34, Icon: LineChart },
  { top: "38%", left: "92%", size: 40, rotate: 8, delay: 2.1, opacity: 0.36, Icon: Target },
  { top: "67%", left: "88%", size: 36, rotate: -8, delay: 2.9, opacity: 0.38, Icon: Coins },
  { top: "45%", left: "78%", size: 40, rotate: 5, delay: 3.0, opacity: 0.32, Icon: Network },
  { top: "66%", left: "7%", size: 46, rotate: 6, delay: 1.1, opacity: 0.4, Icon: BrainCircuit },
  { top: "46%", left: "16%", size: 44, rotate: -8, delay: 0.4, opacity: 0.38, Icon: Handshake },
  { top: "88%", left: "8%", size: 38, rotate: 5, delay: 0.6, opacity: 0.4, Icon: Zap },
];

export function FounderGlyphs({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {GLYPHS.map((g, i) => (
        // outer div holds position + rotation, inner icon handles the float
        // animation — so the two transforms never fight each other.
        <div
          key={i}
          className="absolute"
          style={{
            top: g.top,
            left: g.left,
            opacity: g.opacity,
            transform: `rotate(${g.rotate}deg)`,
          }}
        >
          <g.Icon
            className="text-accent animate-float-slow"
            style={{ width: g.size, height: g.size, animationDelay: `${g.delay}s` }}
            strokeWidth={1.5}
          />
        </div>
      ))}
    </div>
  );
}