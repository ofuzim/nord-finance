'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NordCreditScoreWidgetProps {
  score?: number;
  size?: number;
  variant?: "hero" | "section";
}

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(target);
  const frameRef = useRef<number | null>(null);
  const fromRef  = useRef(target);
  const t0Ref    = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    t0Ref.current   = performance.now();
    const tick = (now: number) => {
      const t     = Math.min((now - t0Ref.current) / duration, 1);
      const ease  = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setValue(Math.round(fromRef.current + (target - fromRef.current) * ease));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return value;
}


export function NordCreditScoreWidget({
  score   = 680,
  size    = 440,
}: NordCreditScoreWidgetProps) {
  const [targetScore, setTargetScore] = useState(score);
  const displayScore = useAnimatedNumber(targetScore, 1400);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const wander = () => {
      setTargetScore(Math.round(250 + Math.random() * 670));
      id = setTimeout(wander, 1600 + Math.random() * 1800);
    };
    id = setTimeout(wander, 1200);
    return () => clearTimeout(id);
  }, []);

  const cx = size / 2;
  const cy = size / 2;

  const outerR = size * 0.455;
  const innerR = size * 0.295;

  const startAngle = -197;
  const totalAngle = 214;
  const numTicks   = 48;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const r4    = (n: number) => Math.round(n * 1e4) / 1e4; // round to 4dp — eliminates SSR/browser float drift
  const norm  = Math.max(0, Math.min(1, (displayScore - 250) / (950 - 250)));

  // Peak tick at 12 o'clock — computed directly, not via the ticks array
  const peakAngle  = startAngle + (totalAngle / 2);          // -197 + 107 = -90°
  const peakCos    = r4(Math.cos(toRad(peakAngle)));         // ≈ 0
  const peakSin    = r4(Math.sin(toRad(peakAngle)));         // = -1
  const peakOuterR = outerR;
  const peakInnerR = innerR - size * 0.05;
  const peakTick   = {
    ox: r4(cx + peakOuterR * peakCos),
    oy: r4(cy + peakOuterR * peakSin),
    ix: r4(cx + peakInnerR * peakCos),
    iy: r4(cy + peakInnerR * peakSin),
  };

  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => {
    const pct      = i / numTicks;
    const angle    = startAngle + pct * totalAngle;
    const isPeak   = i === numTicks / 2;
    const isMajor  = i % 8 === 0 && !isPeak;
    const oR       = outerR;
    const iR       = isPeak
      ? innerR - size * 0.05
      : isMajor ? innerR - size * 0.03 : innerR + size * 0.012;
    const isLit    = pct <= norm;
    const cos      = Math.cos(toRad(angle));
    const sin      = Math.sin(toRad(angle));
    return {
      ox: r4(cx + oR * cos),
      oy: r4(cy + oR * sin),
      ix: r4(cx + iR * cos),
      iy: r4(cy + iR * sin),
      isMajor, isPeak, isLit,
    };
  });

  const gradId  = `ng-${size}`;
  const fogId   = `fog-${size}`;
  const fadeId  = `fade-${size}`;

  const halfH = size - size / 4.5;

  return (
    /* Outer div clips to the top half of the circle */
    <div style={{ position: "relative", width: size, height: halfH, overflow: "hidden" }}>

      {/* Inner full-size div — the circle renders here and gets clipped above */}
      <div style={{ position: "absolute", top: 0, left: 0, width: size, height: size, maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)" }}>

        {/* Dark radial backdrop */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 75%, transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Gold ambient glow */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 50% 46%, rgba(195,149,41,0.12) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* ── Dial + text SVG ── */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
          overflow="visible"
          style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#5a3f0a" />
              <stop offset="50%"  stopColor="#C39529" />
              <stop offset="100%" stopColor="#f5cc55" />
            </linearGradient>

            <filter id={fogId} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation={size * 0.013} result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={`${fogId}-peak`} filterUnits="userSpaceOnUse"
              x={peakTick.ox - 20} y={peakTick.oy - 5}
              width={40} height={peakTick.iy - peakTick.oy + 10}>
              <feGaussianBlur stdDeviation={size * 0.013} result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id={fadeId} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0.52)" />
              <stop offset="75%"  stopColor="rgba(0,0,0,0.18)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)"    />
            </radialGradient>
          </defs>

          {ticks.map((t, i) => t.isPeak ? null : (
            <line key={i}
              x1={t.ox} y1={t.oy} x2={t.ix} y2={t.iy}
              stroke={
                t.isLit
                  ? t.isMajor ? "#C39529" : "rgba(195,149,41,0.52)"
                  : t.isMajor ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)"
              }
              strokeWidth={t.isMajor ? 2.4 : 1.1}
              strokeLinecap="round"
              filter={t.isLit && t.isMajor ? `url(#${fogId})` : undefined}
            />
          ))}

          <circle cx={cx} cy={cy} r={innerR * 0.95} fill={`url(#${fadeId})`} />

          <line
            x1={peakTick.ox} y1={peakTick.oy}
            x2={peakTick.ix} y2={peakTick.iy}
            stroke={norm >= 0.5 ? "#C39529" : "rgba(255,255,255,0.45)"}
            strokeWidth={2.4}
            strokeLinecap="round"
            filter={norm >= 0.5 ? `url(#${fogId}-peak)` : undefined}
          />

          <text x={cx} y={cy - size * 0.18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.36)"
            fontSize={size * 0.020}
            fontFamily="'Poppins', sans-serif"
            fontWeight="400"
            letterSpacing="0.24em"
          >
            <tspan x={cx} dy="0">NORD</tspan>
            <tspan x={cx} dy={size * 0.032}>CREDIT SCORE</tspan>
          </text>

          <text x={cx} y={cy + size * 0.085}
            textAnchor="middle"
            fill="white"
            fontSize={size * 0.22}
            fontFamily="'Poppins', sans-serif"
            fontWeight="400"
            letterSpacing="-0.02em"
          >
            {displayScore}
          </text>

        </svg>
      </div>

      {/* Pill lives in the outer (clipping) div so it's always visible */}
      <Link href="/credit-score" className="widget-pill" style={{
        position: "absolute",
        bottom: size * 0.04,
        left: "50%",
        transform: "translateX(-50%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 100,
        padding: "6px 14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.14)";
          (e.currentTarget as HTMLElement).style.borderColor     = "rgba(255,255,255,0.38)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLElement).style.borderColor     = "rgba(255,255,255,0.22)";
        }}
      >
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          fontSize: size * 0.022,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#C39529",
        }}>
          Calculate Your Score
        </span>
        <span style={{ color: "#C39529", fontSize: size * 0.020 }}>›</span>
      </Link>
    </div>
  );
}
