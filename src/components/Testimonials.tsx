'use client'

import React, { useState } from "react";

const testimonials = [
  {
    quote:
      "The process was nothing like what I expected from a Nigerian finance company. Everything was clear from day one — my score, my rate, my monthly payments. I drove my Mercedes GLE home within a week.",
    name: "Adebayo Okonkwo",
    location: "Lagos, Nigeria",
    car: "Mercedes-Benz GLE 450",
    tier: "Premium Tier",
    tierColor: "#f97316",
    initial: "AO",
    gradient: "135deg, #1c0c00 0%, #5a2a00 100%",
  },
  {
    quote:
      "I'd been turned down twice before. Nord Finance actually explained why, helped me understand my credit profile, and within three months I had approval for my Range Rover Sport. The transparency is unmatched.",
    name: "Chidinma Eze",
    location: "Abuja, Nigeria",
    car: "Range Rover Sport",
    tier: "Core Tier",
    tierColor: "#C39529",
    initial: "CE",
    gradient: "135deg, #1a1400 0%, #3d2e00 100%",
  },
  {
    quote:
      "As an HNI client, I need discretion and speed. Nord Finance delivered both. The Private Bridge product gave me terms that actually made financial sense. My Bentayga was the easiest large purchase I've made.",
    name: "Emeka Nwosu",
    location: "Port Harcourt, Nigeria",
    car: "Bentley Bentayga",
    tier: "Private Bridge",
    tierColor: "#ef4444",
    initial: "EN",
    gradient: "135deg, #1a0000 0%, #3d0000 100%",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section
      style={{
        backgroundColor: "#000",
        padding: "140px 0",
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

      {/* Large decorative quote mark */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'Morpha', Georgia, serif", fontWeight: 400,
          fontSize: 320,
          color: "rgba(195,149,41,0.022)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.05em",
        }}
      >
        "
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 80px",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
        className="test-outer"
      >
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 72,
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
            What Our Clients Say
          </span>
          <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
        </div>

        {/* Featured quote */}
        <h2
          style={{
            fontFamily: "'Morpha', Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(20px, 2.4vw, 34px)",
            lineHeight: 1.62,
            color: "white",
            fontStyle: "italic",
            letterSpacing: "-0.01em",
            marginBottom: 72,
            minHeight: 160,
          }}
        >
          "{t.quote}"
        </h2>

        {/* Avatar row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {testimonials.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: active === i ? 76 : 52,
                  height: active === i ? 76 : 52,
                  borderRadius: "50%",
                  background: `linear-gradient(${item.gradient})`,
                  borderTop: `2px solid ${active === i ? item.tierColor : "rgba(255,255,255,0.08)"}`,
                  borderLeft: `2px solid ${active === i ? item.tierColor : "rgba(255,255,255,0.08)"}`,
                  borderRight: `2px solid ${active === i ? item.tierColor : "rgba(255,255,255,0.08)"}`,
                  borderBottom: `2px solid ${active === i ? item.tierColor : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: active === i
                    ? `0 0 0 5px ${item.tierColor}18`
                    : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: active === i ? 16 : 11,
                    color: active === i ? item.tierColor : "rgba(255,255,255,0.35)",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.initial}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Active client info */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "white",
            marginBottom: 4,
          }}
        >
          {t.name}
        </p>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: 11,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: "0.08em",
            marginBottom: 16,
          }}
        >
          {t.car} &nbsp;·&nbsp; {t.location}
        </p>

        {/* Tier badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: `${t.tierColor}12`,
            border: `1px solid ${t.tierColor}28`,
            borderRadius: 4,
            padding: "5px 14px",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: t.tierColor,
            }}
          >
            {t.tier}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .test-outer { padding: 0 20px !important; }
        }
      `}</style>
    </section>
  );
}
