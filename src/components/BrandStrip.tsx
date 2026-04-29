import React from "react";

const brands = [
  "Mercedes-Benz",
  "BMW",
  "Porsche",
  "Range Rover",
  "Bentley",
  "Audi",
  "Ferrari",
  "Rolls-Royce",
  "Lexus",
  "Lamborghini",
  "Maserati",
];

const track = [...brands, ...brands];

export function BrandStrip() {
  return (
    <section
      style={{
        backgroundColor: "#000",
        padding: "40px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top hairline */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(195,149,41,0.15) 30%, rgba(195,149,41,0.15) 70%, transparent)",
        }}
      />

      {/* Label */}
      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 400,
          fontSize: 9,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.18)",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Financed Marques Include
      </p>

      {/* Marquee viewport with edge fades */}
      <div
        style={{
          overflow: "hidden",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "max-content",
            animation: "brandMarquee 32s linear infinite",
          }}
        >
          {track.map((brand, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 300,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                  whiteSpace: "nowrap",
                  padding: "0 36px",
                }}
              >
                {brand}
              </span>
              <span
                style={{
                  color: "rgba(195,149,41,0.25)",
                  fontSize: 6,
                  flexShrink: 0,
                }}
              >
                ◆
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom hairline */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(195,149,41,0.15) 30%, rgba(195,149,41,0.15) 70%, transparent)",
        }}
      />

      <style>{`
        @keyframes brandMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
