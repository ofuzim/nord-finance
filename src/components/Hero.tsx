'use client'

import React from "react";
import Link from "next/link";
import { NordCreditScoreWidget } from "./NordCreditScoreWidget";
import heroBg from "../imports/C9_A9_A7_dark_smoky_collage.jpg";

const marqueeNames = [
  "Nord A3", "Nord A5", "Nord A7", "Nord A9", "Nord C3", "Nord C9", "Demir", "Tusk", "Max", "Flit",
  "Tripper", "CICA", "Tavet Garent", "Tavet Vant", "Tavet Luto",
];
const heroMarqueeItems = [...marqueeNames, ...marqueeNames];

const stats = [
  { value: "₦32.5M+", label: "Starting From" },
  { value: "9%",       label: "From P.A."    },
  { value: "30%",      label: "Min. Down Payment" },
  { value: "48mo",     label: "Max Tenure"   },
];

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 720,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${heroBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "60% center",
        }}
      />
      {/* Left-heavy black gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.97) 28%, rgba(0,0,0,0.72) 58%, rgba(0,0,0,0.2) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 55%, rgba(0,0,0,1) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 80px",
          display: "grid",
          gridTemplateColumns: "52% 1fr",
          gridTemplateRows: "auto auto",
          alignContent: "center",
          alignItems: "center",
          rowGap: 28,
          columnGap: 60,
          paddingTop: 72,
          paddingBottom: 72,
        }}
        className="hero-grid"
      >
        {/* ── Row 1 / Col 1 — label + headline + body ── */}
        <div
          style={{
            gridColumn: "1",
            gridRow: "1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          className="hero-text"
        >
          <div className="hero-label-row" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
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
              Tiered Vehicle Credit Infrastructure
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Morpha', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(48px, 5.8vw, 86px)",
              lineHeight: 1.04,
              color: "white",
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
            className="hero-headline"
          >
            Drive the car
            <br />
            you <em style={{ fontStyle: "normal", fontWeight: "bold" }}>deserve.</em>
          </h1>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(14px, 1.1vw, 16px)",
              lineHeight: 1.9,
              color: "var(--text-muted)",
              maxWidth: 480,
            }}
          >
            Nord Finance is not a loan provider. It is a structured credit
            system that matches your financial profile to the vehicle and
            financing terms that work for you.
          </p>
        </div>

        {/* ── Row 1 / Col 2 — gauge centered ── */}
        <div
          style={{
            gridColumn: "2",
            gridRow: "1",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          className="hero-widget"
        >
          <div className="hero-widget-scale">
            <NordCreditScoreWidget score={824} size={440} variant="hero" />
          </div>
        </div>

        {/* ── Row 2 / Col 1 — CTAs ── */}
        <div
          style={{
            gridColumn: "1",
            gridRow: "2",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
          className="hero-ctas"
        >
          <Link
            href="/credit-score"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#000",
              textDecoration: "none",
              backgroundColor: "#C39529",
              borderRadius: 100,
              padding: "14px 36px",
              display: "inline-block",
              transition: "background-color 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d4a730")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C39529")}
          >
            Apply Now
          </Link>
          <a
            href="#learn-more"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 100,
              padding: "13px 28px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(195,149,41,0.5)";
              (e.currentTarget as HTMLElement).style.color = "#C39529";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
            }}
          >
            Learn More
          </a>
          <a
            href="https://nordmotion.com/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            View Vehicles <span style={{ fontSize: 11 }}>›</span>
          </a>
        </div>

        {/* ── Row 2 / Col 2 — stats (same row as CTAs) ── */}
        <div
          style={{
            gridColumn: "2",
            gridRow: "2",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
          className="hero-stats"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "14px 16px",
                borderRight: i < 3 ? "1px solid rgba(195,149,41,0.1)" : "none",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1,
                  marginBottom: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  fontSize: 8,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                  whiteSpace: "nowrap",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>


      {/* ── Label above marquee ── */}
      <div style={{ position: "absolute", bottom: 52, left: 0, right: 0, zIndex: 10, textAlign: "center" }}>
        <span style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 10,
          letterSpacing: "0.08em", color: "rgba(255, 255, 255, 0.45)",
        }}>
          Nord Models Available for Financing
        </span>
      </div>

      {/* ── Bottom marquee strip ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: "14px 0", overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(195,149,41,0.3) 30%, rgba(195,149,41,0.3) 70%, transparent)",
        }} />
        <div className="marquee-track" style={{
          display: "flex", alignItems: "center", width: "max-content",
          animation: "heroMarquee 52s linear infinite",
        }}>
          {heroMarqueeItems.map((name, i) => (
            <React.Fragment key={i}>
              <span style={{
                fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: 10,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap",
                padding: "0 32px", cursor: "pointer", transition: "color 0.2s ease",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.color = "#C39529");
                  (e.currentTarget.closest(".marquee-track") as HTMLElement | null)?.style.setProperty("animation-play-state", "paused");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.color = "rgba(255,255,255,0.2)");
                  (e.currentTarget.closest(".marquee-track") as HTMLElement | null)?.style.setProperty("animation-play-state", "running");
                }}
              >{name}</span>
              <span style={{ color: "#C39529", fontSize: 5, flexShrink: 0 }}>◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            padding: 76px 28px 40px !important;
            row-gap: 16px !important;
          }
          .hero-widget { display: flex !important; grid-column: 1 !important; grid-row: 1 !important; justify-content: center !important; align-items: flex-start !important; overflow: hidden !important; width: 100% !important; }
          .hero-widget-scale { transform: scale(0.5); transform-origin: top center; margin-bottom: -171px; }
          .widget-pill { display: none !important; }
          .hero-text { grid-column: 1 !important; grid-row: 2 !important; padding-top: 0 !important; justify-content: flex-start !important; text-align: center !important; align-items: center !important; }
          .hero-text p { max-width: 100% !important; }
          .hero-label-row { justify-content: center !important; }
          .hero-ctas { grid-column: 1 !important; grid-row: 3 !important; padding-bottom: 0 !important; justify-content: center !important; }
          .hero-stats { display: none !important; }
          .hero-headline { font-size: clamp(44px, 8vw, 68px) !important; }
        }
      `}</style>
    </section>
  );
}
