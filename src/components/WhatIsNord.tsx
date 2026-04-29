'use client'

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import carBg from "../imports/A9-10.jpg";

const tiers = [
  {
    badge: "ACCESS",
    title: "Access Tier",
    color: "#8B6914",
    rate: "28%+",
    rateNote: "Per annum",
    score: "< 700",
    features: [
      "12 – 48 month tenure",
      "Lower qualification threshold",
      "30% minimum down payment",
      "High-volume access product",
      "Vehicles from ₦32.5M",
    ],
  },
  {
    badge: "CORE",
    title: "Core Tier",
    color: "#C39529",
    rate: "22%",
    rateNote: "Per annum",
    score: "700 – 800",
    features: [
      "12 – 36 month tenure",
      "Balanced risk profile",
      "Strong repayment behavior",
      "Primary revenue tier",
      "Full vehicle range",
    ],
  },
  {
    badge: "PREMIUM",
    title: "Premium Tier",
    color: "#D4A535",
    rate: "18%",
    rateNote: "Per annum (avg.)",
    score: "800 – 850",
    featured: true,
    features: [
      "12 – 18 month tenure",
      "Strong financial profiles",
      "Lower default exposure",
      "Concierge support",
      "Expedited processing",
    ],
  },
  {
    badge: "PRIVATE BRIDGE",
    title: "HNI Product",
    color: "#EDD98A",
    rate: "9%",
    rateNote: "Annualized (from)",
    score: "850+",
    features: [
      "6-month tenure only",
      "50% down payment",
      "Liquidity preservation",
      "High-net-worth individuals",
      "Fastest cycle time",
    ],
  },
];

export function WhatIsNord() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current || !bgRef.current) return;
        if (window.innerWidth <= 768) {
          bgRef.current.style.transform = "translateY(0px)";
          return;
        }
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionH = sectionRef.current.offsetHeight;
        const progress = (rect.top + sectionH / 2 - window.innerHeight / 2) / window.innerHeight;
        bgRef.current.style.transform = `translateY(${progress * 60}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="plans"
      ref={sectionRef}
      style={{
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        scrollMarginTop: 72,
      }}
    >
      {/* Full-bleed car background */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          top: -80,
          left: 0,
          right: 0,
          bottom: -80,
          backgroundImage: `url(${carBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          willChange: "transform",
        }}
      />

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 1440, margin: "0 auto", padding: "140px 80px",
      }} className="what-outer">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, gap: 40 }} className="what-header">
          <div>
            <div className="what-eyebrow" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C39529" }}>
                Product Tiers
              </span>
            </div>
            <h2 className="what-title" style={{
              fontFamily: "'Morpha', Georgia, serif",
              fontWeight: 400, fontSize: "clamp(38px, 3.8vw, 60px)",
              lineHeight: 1.08, color: "white", letterSpacing: "-0.02em",
            }}>
              Four tiers.{" "}
              <em style={{ fontStyle: "normal", fontWeight: "bold" }}>One system.</em>
            </h2>
          </div>
          <p style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: 14,
            lineHeight: 1.8, color: "rgba(255,255,255,0.75)", maxWidth: 360, textAlign: "right",
          }} className="what-sub">
            Every borrower is different. Our tiered structure ensures your financing matches your financial reality — fairly and transparently.
          </p>
        </div>

        {/* Tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="what-grid">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className="what-card"
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{
                backgroundColor: "rgba(14, 14, 16, 0.58)",
                backdropFilter: "blur(52px) saturate(0.68)",
                WebkitBackdropFilter: "blur(52px) saturate(0.68)",
                borderTop: `2px solid ${tier.color}`,
                borderRight: activeIdx === i ? `1px solid ${tier.color}50` : "1px solid rgba(255,255,255,0.12)",
                borderBottom: activeIdx === i ? `1px solid ${tier.color}50` : "1px solid rgba(255,255,255,0.12)",
                borderLeft: activeIdx === i ? `1px solid ${tier.color}50` : "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14, padding: "32px 28px 28px",
                display: "flex", flexDirection: "column",
                transition: "all 0.25s ease",
                transform: activeIdx === i ? "translateY(-6px)" : "translateY(0)",
                position: "relative", overflow: "hidden",
              }}
            >
              {activeIdx === i && (
                <div style={{
                  position: "absolute", inset: 0,
                  background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.09) 0%, transparent 58%)",
                  pointerEvents: "none",
                }} />
              )}

              {/* Badge pill */}
              <div style={{ marginBottom: 20, position: "relative", zIndex: 1 }}>
                <span className="what-card-badge" style={{
                  display: "inline-block",
                  fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 9,
                  letterSpacing: "0.18em", textTransform: "uppercase", color: tier.color,
                  border: `1px solid ${tier.color}60`, borderRadius: 4,
                  padding: "4px 10px",
                }}>
                  {tier.badge}
                </span>
                {tier.featured && (
                  <span className="what-card-popular" style={{
                    marginLeft: 6,
                    display: "inline-block",
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 8,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: "#000",
                    backgroundColor: tier.color, borderRadius: 4, padding: "4px 8px",
                  }}>POPULAR</span>
                )}
              </div>

              {/* Tier title */}
              <p style={{
                fontFamily: "'Morpha', Georgia, serif",
                fontWeight: 400, fontSize: 22, color: "white",
                marginBottom: 20, lineHeight: 1.2, position: "relative", zIndex: 1,
              }}>{tier.title}</p>

              {/* Rate */}
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700, fontSize: "clamp(36px, 3vw, 52px)",
                color: tier.color, lineHeight: 1, display: "block",
                marginBottom: 6, position: "relative", zIndex: 1,
              }}>{tier.rate}</span>
              <span className="what-card-rate-note" style={{
                fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 10,
                letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)",
                marginBottom: 24, display: "block", position: "relative", zIndex: 1,
              }}>{tier.rateNote}</span>

              <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1, position: "relative", zIndex: 1 }}>
                {tier.features.map((f, fi) => (
                  <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>—</span>
                    <span className="what-card-feature" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Score */}
              <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                <span className="what-card-score-label" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>Score Required:</span>
                <span className="what-card-score" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, color: tier.color }}>{tier.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            margin: "44px auto 0",
            maxWidth: 760,
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 18,
            padding: "28px 32px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
          className="plans-cta"
        >
          <p className="plans-cta-text" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(255,255,255,0.66)", margin: 0, lineHeight: 1.7 }}>
            Rates are indicative. Check your Nord Credit Score to see your likely tier before submitting a financing application.
          </p>
          <Link
            href="/credit-score"
            style={{
              flexShrink: 0,
              backgroundColor: "#C39529",
              color: "#000",
              borderRadius: 100,
              padding: "14px 24px",
              textDecoration: "none",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Check My Score
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .what-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .what-outer { padding: 80px 40px !important; }
          .what-header { flex-direction: column !important; align-items: flex-start !important; }
          .what-sub { text-align: left !important; max-width: 100% !important; }
          .plans-cta { flex-direction: column !important; align-items: flex-start !important; }
        }
        @media (max-width: 960px) {
          .what-outer { padding: 72px 28px !important; }
          .what-header { gap: 12px !important; margin-bottom: 28px !important; }
          .what-eyebrow { gap: 10px !important; margin-bottom: 14px !important; }
          .what-eyebrow span:first-child { font-size: 10px !important; }
          .what-eyebrow span:last-child { font-size: 9px !important; letter-spacing: 0.2em !important; }
          .what-title { font-size: 30px !important; line-height: 1.08 !important; margin: 0 !important; }
          .what-sub { font-size: 14px !important; line-height: 1.8 !important; margin: 0 !important; }
          .what-card-badge { font-size: 10px !important; letter-spacing: 0.16em !important; }
          .what-card-popular { font-size: 9px !important; }
          .what-card-rate-note { font-size: 11px !important; color: rgba(255,255,255,0.46) !important; }
          .what-card-feature { font-size: 13px !important; line-height: 1.6 !important; color: rgba(255,255,255,0.68) !important; }
          .what-card-score-label { font-size: 10px !important; color: rgba(255,255,255,0.42) !important; }
          .what-card-score { font-size: 14px !important; }
          .plans-cta { align-items: center !important; text-align: center !important; }
          .plans-cta-text { font-size: 14px !important; line-height: 1.75 !important; color: rgba(255,255,255,0.72) !important; }
        }
        @media (max-width: 600px) {
          .what-grid { grid-template-columns: 1fr !important; }
          .what-outer { padding: 72px 24px !important; }
        }
      `}</style>
    </section>
  );
}
