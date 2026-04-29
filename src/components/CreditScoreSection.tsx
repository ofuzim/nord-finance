'use client'

import React from "react";
import { NordCreditScoreWidget } from "./NordCreditScoreWidget";

const tiers = [
  { label: "Access", range: "< 700", rate: "28%+", color: "#22c55e" },
  { label: "Core", range: "700 – 800", rate: "22% p.a.", color: "#C39529" },
  { label: "Premium", range: "800 – 850", rate: "18% avg.", color: "#f97316" },
  { label: "Private Bridge", range: "850+", rate: "9% from", color: "#ef4444" },
];

const factors = [
  { label: "Income Stability", weight: "High" },
  { label: "Credit History", weight: "High" },
  { label: "Existing Obligations", weight: "Medium" },
  { label: "Net Asset Position", weight: "Medium" },
];

export function CreditScoreSection() {
  return (
    <section
      style={{
        backgroundColor: "#000",
        padding: "140px 0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top separator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(195,149,41,0.3) 30%, rgba(195,149,41,0.3) 70%, transparent)",
        }}
      />

      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(195,149,41,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
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
        className="score-outer"
      >
        {/* Two column */}
        <div
          style={{ display: "flex", gap: 80, alignItems: "flex-start", marginBottom: 72 }}
          className="score-inner"
        >
          {/* Left */}
          <div style={{ flex: "0 0 48%" }} className="score-left">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 32,
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
                The Nord Credit Score
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Morpha', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(38px, 3.5vw, 56px)",
                lineHeight: 1.1,
                color: "white",
                marginBottom: 36,
                letterSpacing: "-0.02em",
              }}
            >
              Your score.
              <br />
              Your rate.
              <br />
              <em style={{ fontStyle: "normal", fontWeight: "bold" }}>
                Your car.
              </em>
            </h2>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.48)",
                marginBottom: 16,
              }}
            >
              The Nord Credit Score is a proprietary assessment system that
              evaluates your financial profile across multiple dimensions.
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                fontSize: 15,
                lineHeight: 1.85,
                color: "rgba(255,255,255,0.48)",
                marginBottom: 44,
              }}
            >
              Higher scores unlock lower rates and longer tenures — built to
              reward financial discipline and to ensure the terms you receive
              are terms you can sustain.
            </p>

            {/* Score factors */}
            <div
              style={{
                border: "1px solid rgba(195,149,41,0.12)",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(195,149,41,0.12)",
                  backgroundColor: "rgba(195,149,41,0.04)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Assessment Factors
                </span>
              </div>
              {factors.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom:
                      i < factors.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {f.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#C39529",
                      backgroundColor: "rgba(195,149,41,0.08)",
                      border: "1px solid rgba(195,149,41,0.2)",
                      borderRadius: 4,
                      padding: "3px 10px",
                    }}
                  >
                    {f.weight}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#"
              style={{
                display: "inline-block",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#C39529",
                textDecoration: "none",
                border: "1px solid rgba(195,149,41,0.4)",
                borderRadius: 6,
                padding: "13px 28px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "#C39529";
                (e.currentTarget as HTMLElement).style.color = "#000";
                (e.currentTarget as HTMLElement).style.borderColor = "#C39529";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color = "#C39529";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(195,149,41,0.4)";
              }}
            >
              Check Your Score
            </a>
          </div>

          {/* Right — Widget */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 20,
            }}
            className="score-right"
          >
            <NordCreditScoreWidget score={824} size={400} variant="section" />
          </div>
        </div>

        {/* Tier bands */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid rgba(195,149,41,0.12)",
            borderRadius: 10,
            overflow: "hidden",
          }}
          className="tier-bands"
        >
          {tiers.map((tier, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#060606",
                padding: "28px 24px",
                borderTop: `2px solid ${tier.color}`,
                borderRight:
                  i < 3 ? "1px solid rgba(195,149,41,0.08)" : "none",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: tier.color,
                }}
              >
                {tier.label}
              </span>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "white",
                }}
              >
                {tier.range}
              </span>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {tier.rate}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .score-outer { padding: 0 28px !important; }
          .score-inner { flex-direction: column !important; gap: 52px !important; }
          .score-left, .score-right { flex: 1 1 auto !important; }
          .tier-bands { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .tier-bands { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
