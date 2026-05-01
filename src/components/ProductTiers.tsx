'use client'

import React, { useState } from "react";

const tiers = [
  {
    name: "Access",
    badge: "ACCESS TIER",
    color: "#22c55e",
    rate: "28%+",
    rateNote: "per annum",
    score: "< 700",
    desc: "Entry-level vehicle credit for those beginning their financing journey.",
    features: [
      "Standard documentation",
      "12 – 24 months tenure",
      "30% minimum down payment",
      "Entry vehicle portfolio",
    ],
  },
  {
    name: "Core",
    badge: "CORE TIER",
    color: "#38bdf8",
    rate: "22%",
    rateNote: "per annum",
    score: "700 – 800",
    desc: "Mainstream access to a broader vehicle range with competitive terms.",
    features: [
      "Streamlined processing",
      "12 – 36 months tenure",
      "30% minimum down payment",
      "Extended vehicle portfolio",
    ],
  },
  {
    name: "Premium",
    badge: "PREMIUM TIER",
    color: "#f97316",
    rate: "18%",
    rateNote: "avg. per annum",
    score: "800 – 850",
    desc: "Priority access to premium vehicles and expedited approval.",
    features: [
      "Priority processing",
      "12 – 48 months tenure",
      "30% minimum down payment",
      "Premium vehicle selection",
    ],
    featured: true,
  },
  {
    name: "Private Bridge",
    badge: "PRIVATE BRIDGE",
    color: "#a855f7",
    rate: "9%",
    rateNote: "from per annum",
    score: "850+",
    desc: "Bespoke financing for strong credit profiles with full portfolio access.",
    features: [
      "Dedicated relationship manager",
      "Flexible tenure up to 48mo",
      "Custom down payment terms",
      "Full luxury portfolio",
    ],
  },
];

export function ProductTiers() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section
      className="tiers-section"
      style={{
        backgroundColor: "#000",
        padding: "140px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gold border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(195,149,41,0.4) 30%, rgba(195,149,41,0.4) 70%, transparent)",
        }}
      />

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 80px",
          position: "relative",
          zIndex: 1,
        }}
        className="tiers-outer"
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 64,
            gap: 40,
          }}
          className="tiers-header"
        >
          <div>
            <div
              className="tiers-eyebrow"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#C39529",
                }}
              >
                Product Tiers
              </span>
            </div>
            <h2
              className="tiers-title"
              style={{
                fontFamily: "'Morpha', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(38px, 3.8vw, 60px)",
                lineHeight: 1.08,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Four tiers.{" "}
              <em style={{ fontStyle: "normal", fontWeight: "bold" }}>
                One system.
              </em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 300,
              fontSize: 14,
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.4)",
              maxWidth: 360,
              textAlign: "right",
            }}
            className="tiers-sub"
          >
            Every borrower is different. Our tiered structure ensures your
            financing matches your financial reality — fairly and transparently.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}
          className="tiers-grid"
        >
          {tiers.map((tier, i) => (
            <div
              key={i}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{
                backgroundColor: "#090909",
                borderTop: `2px solid ${tier.color}`,
                borderLeft: activeIdx === i ? `1px solid ${tier.color}50` : "1px solid rgba(255,255,255,0.06)",
                borderRight: activeIdx === i ? `1px solid ${tier.color}50` : "1px solid rgba(255,255,255,0.06)",
                borderBottom: activeIdx === i ? `1px solid ${tier.color}50` : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: "36px 28px 28px",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
                transition: "all 0.3s ease",
                transform: activeIdx === i ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  activeIdx === i
                    ? `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${tier.color}12`
                    : "0 4px 24px rgba(0,0,0,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle background glow on active */}
              {activeIdx === i && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at top, ${tier.color}08 0%, transparent 60%)`,
                    pointerEvents: "none",
                  }}
                />
              )}

              {tier.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    backgroundColor: tier.color,
                    color: "#000",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: 8,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 3,
                  }}
                >
                  POPULAR
                </div>
              )}

              {/* Badge */}
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: tier.color,
                  marginBottom: 24,
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {tier.badge}
              </span>

              {/* Rate */}
              <div
                style={{
                  marginBottom: 4,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(44px, 4vw, 60px)",
                    color: tier.color,
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {tier.rate}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: 20,
                  display: "block",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {tier.rateNote}
              </span>

              {/* Desc */}
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 300,
                  fontSize: 12,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 24,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {tier.desc}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.07)",
                  marginBottom: 20,
                }}
              />

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {tier.features.map((f, fi) => (
                  <li
                    key={fi}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                  >
                    <span
                      style={{
                        color: tier.color,
                        fontSize: 10,
                        marginTop: 2,
                        flexShrink: 0,
                        lineHeight: 1,
                      }}
                    >
                      ✦
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 400,
                        fontSize: 12,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.4,
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Score */}
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 18,
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  Score Required
                </span>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: tier.color,
                    opacity: 0.9,
                  }}
                >
                  {tier.score}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            textAlign: "center",
            marginTop: 32,
            letterSpacing: "0.04em",
          }}
        >
          Rates are indicative. Your final rate is determined by your Nord
          Credit Score assessment.
        </p>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .tiers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tiers-outer { padding: 0 40px !important; }
          .tiers-header { flex-direction: column !important; align-items: flex-start !important; }
          .tiers-sub { text-align: left !important; max-width: 100% !important; }
        }
        @media (max-width: 960px) {
          .tiers-section { padding: 72px 0 !important; }
          .tiers-header { gap: 14px !important; margin-bottom: 28px !important; }
          .tiers-eyebrow { gap: 10px !important; margin-bottom: 14px !important; }
          .tiers-eyebrow span:first-child { font-size: 10px !important; }
          .tiers-eyebrow span:last-child { font-size: 9px !important; letter-spacing: 0.2em !important; }
          .tiers-title { font-size: 30px !important; line-height: 1.08 !important; margin: 0 !important; }
          .tiers-sub { font-size: 13px !important; line-height: 1.75 !important; margin: 0 !important; }
        }
        @media (max-width: 600px) {
          .tiers-grid { grid-template-columns: 1fr !important; }
          .tiers-outer { padding: 0 24px !important; }
        }
      `}</style>
    </section>
  );
}
