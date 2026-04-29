'use client'

import React, { useEffect, useRef, useState } from "react";
import churchImg from "../imports/Nord-A7-church-2.jpg";

const steps = [
  {
    number: "01",
    title: "Choose Your Vehicle",
    desc: "Browse the Nord Automobiles portfolio. Select the vehicle that matches your aspirations and your tier.",
  },
  {
    number: "02",
    title: "Check Your Score",
    desc: "Your Nord Credit Score is calculated from your financial profile. See your tier and eligible financing terms upfront.",
  },
  {
    number: "03",
    title: "Apply in Minutes",
    desc: "Complete your structured application online. Upload your KYC documents. Approval delivered in as little as 24 hours.",
  },
  {
    number: "04",
    title: "Drive Home",
    desc: "Documents signed. Keys handed over. Your structured financing is active from day one.",
  },
];


const STEP_THRESHOLDS = [0.05, 0.3, 0.55, 0.78];

export function HowItWorks() {
  const [progress, setProgress] = useState(0);
  const [aboutProgress, setAboutProgress] = useState(0);
  const aboutRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const windowH = window.innerHeight;

        if (aboutRef.current) {
          const rect = aboutRef.current.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH * 0.75)));
          setAboutProgress(p);
        }

        if (stepsRef.current) {
          const rect = stepsRef.current.getBoundingClientRect();
          // 0 when section enters viewport bottom, 1 when top reaches 30% from top
          const p = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH * 0.7)));
          setProgress(p);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const stepProgress = (i: number) => {
    const t = STEP_THRESHOLDS[i];
    return Math.max(0, Math.min(1, (progress - t) / 0.18));
  };

  const badgeProgress = (delay: number) => Math.max(0, Math.min(1, (aboutProgress - delay) / 0.22));

  return (
    <section
      id="learn-more"
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

      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 80px",
          position: "relative",
          zIndex: 1,
        }}
        className="how-outer"
      >
        {/* ── About block: image left, text right ── */}
        <div ref={aboutRef} style={{ display: "flex", gap: 80, alignItems: "center", marginBottom: 80 }} className="about-block">

          {/* Left — image with floating cards bleeding outside */}
          <div style={{ flex: "0 0 46%", position: "relative" }} className="about-img">
            {/* Image clipped separately so cards can overflow */}
            <div style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}>
              <img
                src={churchImg.src}
                alt="Nord Finance"
                style={{ width: "100%", height: 480, objectFit: "cover", objectPosition: "center", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0, 0, 0, 0)",
                borderRadius: 16,
              }} />
            </div>

            {/* Card 1 — top-left, bleeding outside */}
            <div style={{
              position: "absolute", top: 24, left: -24,
              opacity: badgeProgress(0.12),
              transform: `translate3d(${-18 + badgeProgress(0.12) * 18}px, ${(1 - badgeProgress(0.12)) * 14}px, 0)`,
              backgroundColor: "rgba(28,28,28,0.68)",
              backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 40px rgba(0,0,0,0.28)",
              borderRadius: 14, padding: "14px 18px",
              transition: "opacity 0.45s ease 0.06s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.06s",
              willChange: "transform, opacity",
            }}>
              <span style={{
                display: "block", fontFamily: "'Poppins', sans-serif",
                fontWeight: 400, fontSize: 10, color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.06em", marginBottom: 6,
              }}>Service Coverage</span>
              <span style={{
                display: "block", fontFamily: "'Poppins', sans-serif",
                fontWeight: 700, fontSize: 26, color: "white", lineHeight: 1, marginBottom: 4,
              }}>Nationwide</span>
              <span style={{
                display: "block", fontFamily: "'Poppins', sans-serif",
                fontWeight: 400, fontSize: 10, color: "#C39529", letterSpacing: "0.04em",
              }}>Available across Nigeria</span>
            </div>

            {/* Card 2 — bottom-right, bleeding outside */}
            <div style={{
              position: "absolute", bottom: -20, right: -24,
              opacity: badgeProgress(0.46),
              transform: `translate3d(${42 - badgeProgress(0.46) * 42}px, ${(1 - badgeProgress(0.46)) * 48}px, 0) scale(${0.88 + badgeProgress(0.46) * 0.12})`,
              backgroundColor: "rgba(28,28,28,0.68)",
              backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 40px rgba(0,0,0,0.28)",
              borderRadius: 14, padding: "12px 20px",
              display: "flex", alignItems: "center", gap: 12,
              whiteSpace: "nowrap",
              transition: "opacity 0.45s ease 0.18s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.18s",
              willChange: "transform, opacity",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid rgba(195,149,41,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#C39529", fontSize: 14, flexShrink: 0,
              }}>⏱</div>
              <div>
                <span style={{
                  display: "block", fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400, fontSize: 10, color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.06em", marginBottom: 2,
                }}>Approval Time</span>
                <span style={{
                  display: "block", fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700, fontSize: 18, color: "white", lineHeight: 1,
                }}>24 hrs</span>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
              <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
              <span style={{
                fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 10,
                letterSpacing: "0.25em", textTransform: "uppercase", color: "#C39529",
              }}>
                About Nord Finance
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Morpha', Georgia, serif",
              fontWeight: 400, fontSize: "clamp(34px, 3.4vw, 54px)",
              lineHeight: 1.08, color: "white", letterSpacing: "-0.02em", marginBottom: 28,
            }}>
              Vehicle ownership,{" "}
              <em style={{ fontStyle: "normal", fontWeight: "bold" }}>reimagined</em>{" "}
              through credit.
            </h2>

            <p style={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: 15,
              lineHeight: 1.9, color: "var(--text-muted)", maxWidth: 480,
            }}>
              Nord Finance is the structured vehicle credit arm of Nord Automobiles
              Limited. We don't just facilitate car purchases — we architect financing
              solutions built around your financial reality. Every applicant is assessed,
              scored, and matched to a credit tier that reflects who they are financially.
            </p>

          </div>
        </div>

        {/* Steps — timeline style */}
        <div ref={stepsRef} style={{ position: "relative" }} className="how-steps">

          {/* Track line (full width, muted) */}
          <div style={{
            position: "absolute", top: 28, left: "12.5%", right: "12.5%", height: 1,
            backgroundColor: "rgba(195,149,41,0.15)",
          }}>
            {/* Animated fill line */}
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0,
              backgroundColor: "#C39529",
              width: `${progress * 100}%`,
            }} />
          </div>

          <div style={{ display: "flex" }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center",
                opacity: stepProgress(i),
                transform: `translateY(${(1 - stepProgress(i)) * 20}px)`,
              }}>
                {/* Circle */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  border: "1.5px solid #C39529",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: "#000", position: "relative", zIndex: 1,
                  marginBottom: 28, flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                    fontSize: 13, color: "#C39529", letterSpacing: "0.05em",
                  }}>{step.number}</span>
                </div>

                <h3 style={{
                  fontFamily: "'Poppins', sans-serif", fontWeight: 700,
                  fontSize: 16, color: "white", marginBottom: 12, letterSpacing: "0.01em",
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: "'Poppins', sans-serif", fontWeight: 300,
                  fontSize: 13, lineHeight: 1.75, color: "var(--text-muted)",
                  maxWidth: 200,
                }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 960px) {
          .how-outer { padding: 80px 28px !important; }
          .about-block { flex-direction: column !important; gap: 40px !important; margin-bottom: 72px !important; }
          .about-img { flex: 1 1 auto !important; width: 100% !important; }
          .about-img img { height: 300px !important; }
          .how-steps > div { flex-direction: column !important; gap: 40px !important; }
          .how-header { flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
