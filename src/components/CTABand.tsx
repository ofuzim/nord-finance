'use client'

import React from "react";
import Link from "next/link";
import carBg from "../imports/C3-6-2.jpg";

export function CTABand() {
  return (
    <section
      className="cta-band"
      style={{
        position: "relative",
        backgroundColor: "#000",
        overflow: "hidden",
        minHeight: 680,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Full-section car background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${carBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />

      {/* Full-image darkness overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.68)",
        }}
      />

      {/* Side vignettes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "100px 80px 56px",
          maxWidth: 1440,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
        className="cta-inner"
      >
        {/* Label */}
        <div
          className="cta-eyebrow"
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}
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
            Start Your Journey
          </span>
          <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
        </div>

        {/* Headline with decorative rule lines flanking */}
        <div
          className="cta-title-wrap"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            marginBottom: 24,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {/* Left rules */}
          <div
            style={{ flex: 1, maxWidth: 180, display: "flex", flexDirection: "column", gap: 7 }}
            className="cta-rule"
          >
            <div style={{ height: 1, backgroundColor: "rgba(195,149,41,0.22)" }} />
            <div style={{ height: 1, backgroundColor: "rgba(195,149,41,0.07)" }} />
          </div>

          <h2
            className="cta-title"
            style={{
              fontFamily: "'Morpha', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(40px, 5vw, 76px)",
              lineHeight: 1.06,
              color: "white",
              letterSpacing: "-0.02em",
              flexShrink: 0,
              maxWidth: 720,
            }}
          >
            Drive Beyond{" "}
            <br />
            <em style={{ fontStyle: "normal", fontWeight: "bold" }}>Expectations.</em>
          </h2>

          {/* Right rules */}
          <div
            style={{ flex: 1, maxWidth: 180, display: "flex", flexDirection: "column", gap: 7 }}
            className="cta-rule"
          >
            <div style={{ height: 1, backgroundColor: "rgba(195,149,41,0.22)" }} />
            <div style={{ height: 1, backgroundColor: "rgba(195,149,41,0.07)" }} />
          </div>
        </div>

        <p
          className="cta-description"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 300,
            fontSize: 15,
            lineHeight: 1.85,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 460,
            marginBottom: 48,
          }}
        >
          Apply today and receive your Nord Credit Score assessment within 24
          hours. No obligation. Full transparency from the first step.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/credit-score"
            prefetch={false}
            onClick={(event) => {
              event.preventDefault();
              window.location.assign("/credit-score");
            }}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#000",
              textDecoration: "none",
              backgroundColor: "#C39529",
              borderRadius: 100,
              padding: "16px 48px",
              display: "inline-block",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#d4a730";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "#C39529";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Apply Now →
          </Link>
          <a
            href="https://wa.me/2348149799150"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.88)",
              textDecoration: "none",
              border: "1px solid rgba(195,149,41,0.46)",
              backgroundColor: "rgba(195,149,41,0.1)",
              borderRadius: 100,
              padding: "15px 28px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#C39529";
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(195,149,41,0.18)";
              (e.currentTarget as HTMLElement).style.color = "#C39529";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(195,149,41,0.46)";
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(195,149,41,0.1)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.88)";
            }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 32 32"
              style={{
                width: 15,
                height: 15,
                color: "rgba(255,255,255,0.9)",
                flexShrink: 0,
              }}
            >
              <path
                fill="currentColor"
                d="M16.02 4C9.42 4 4.05 9.35 4.05 15.93c0 2.12.56 4.19 1.63 6.02L4 28l6.23-1.63a11.96 11.96 0 0 0 5.79 1.47h.01c6.59 0 11.96-5.35 11.96-11.93C27.99 9.35 22.62 4 16.02 4Zm0 21.82h-.01a9.93 9.93 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.23-.37a9.86 9.86 0 0 1-1.51-5.3c0-5.46 4.43-9.9 9.88-9.9 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.89 6.99c-.01 5.46-4.44 9.9-9.89 9.9Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.1 4.52.71.31 1.27.49 1.71.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"
              />
            </svg>
            WhatsApp Us
          </a>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .cta-band { min-height: 0 !important; }
          .cta-inner { padding: 72px 28px 48px !important; }
          .cta-eyebrow { gap: 10px !important; margin-bottom: 14px !important; }
          .cta-eyebrow span:first-child,
          .cta-eyebrow span:last-child { font-size: 10px !important; }
          .cta-eyebrow span:nth-child(2) { font-size: 9px !important; letter-spacing: 0.2em !important; }
          .cta-title-wrap { margin-bottom: 16px !important; }
          .cta-title { font-size: 38px !important; line-height: 1.06 !important; margin: 0 !important; }
          .cta-description { font-size: 15px !important; line-height: 1.8 !important; margin-bottom: 32px !important; }
          .cta-rule { display: none !important; }
        }
      `}</style>
    </section>
  );
}
