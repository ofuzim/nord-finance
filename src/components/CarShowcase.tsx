'use client'

import React, { useEffect, useRef, useState } from "react";
import carA97 from "../imports/A9-7.jpg";
import maxCity from "../imports/Max-city-high-rise-gen.jpg";
import carChurch1 from "../imports/Nord-A7-church-1.jpg";
import nordC3 from "../imports/nord-c3.jpg";

const cars = [
  { img: carA97.src, name: "Nord A9", category: "Executive Sedan", price: "From ₦56M", year: "2026", url: "https://nordmotion.com/vehicle/nord-a9/" },
  { img: maxCity.src, name: "Nord Max", category: "Urban Edition", price: "From ₦38.9M", year: "2026", url: "https://nordmotion.com/vehicle/max/" },
  { img: carChurch1.src, name: "Nord A7", category: "Grand Tourer", price: "From ₦73M", year: "2026", url: "https://nordmotion.com/vehicle/nord-a7/" },
  { img: nordC3.src, name: "Nord C3", category: "Sport Coupé", price: "From ₦32.5M", year: "2026", url: "https://nordmotion.com/vehicle/nord-c3/" },
];

function CarModal({ car, onClose }: { car: typeof cars[0]; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 350);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`car-modal-backdrop${closing ? " closing" : ""}`}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`car-modal-inner${closing ? " closing" : ""}`}
        style={{
          width: "100%",
          maxWidth: 680,
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#0e0e10",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 420 }} className="car-modal-img-wrap">
          <img
            src={car.img}
            alt={car.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.92) 100%)",
          }} />
          {/* Name over image */}
          <div className="car-modal-name-block" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C39529", marginBottom: 8 }}>
              {car.year} · {car.category}
            </p>
            <p style={{ fontFamily: "'Morpha', Georgia, serif", fontWeight: 400, fontSize: 34, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {car.name}
            </p>
          </div>
        </div>

        {/* Footer bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.07)" }} className="car-modal-footer">
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 16, color: "#C39529" }}>{car.price}</span>
          <a
            href={car.url}
            target="_blank"
            rel="noreferrer"
            onClick={handleClose}
            style={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 10,
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#000", backgroundColor: "#C39529",
              borderRadius: 100, padding: "11px 20px",
              textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            View on Nord →
          </a>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%", width: 36, height: 36, cursor: "pointer",
            color: "rgba(255,255,255,0.7)", fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>

      <style>{`
        @keyframes car-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes car-backdrop-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes car-modal-in {
          from { opacity: 0; transform: scale(0.92) translateY(22px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes car-modal-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.92) translateY(22px); }
        }
        @keyframes car-name-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .car-modal-backdrop         { animation: car-backdrop-in 0.22s ease both; }
        .car-modal-backdrop.closing { animation: car-backdrop-out 0.3s ease both; }
        .car-modal-inner            { animation: car-modal-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .car-modal-inner.closing    { animation: car-modal-out 0.3s cubic-bezier(0.4, 0, 1, 1) both; }
        .car-modal-name-block { animation: car-name-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both; }
        .car-modal-footer     { animation: car-name-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.26s both; }
        @media (max-width: 600px) {
          .car-modal-img-wrap { height: 280px !important; }
          .car-modal-name-block { padding: 20px 22px !important; }
          .car-modal-name-block p:last-child { font-size: 26px !important; }
          .car-modal-footer { padding: 16px 22px !important; }
        }
      `}</style>
    </div>
  );
}

export function CarShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCar, setSelectedCar] = useState<typeof cars[0] | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 356 : -356, behavior: "smooth" });
  };

  return (
    <section
      id="collection"
      className="showcase-section"
      style={{
        backgroundColor: "#000",
        padding: "120px 0 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      {/* Header */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto 52px",
          padding: "0 80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
        className="showcase-header"
      >
        <div>
          <div className="showcase-eyebrow" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
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
              Our Collection
            </span>
          </div>
          <h2
            className="showcase-title"
            style={{
              fontFamily: "'Morpha', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(36px, 3.6vw, 56px)",
              lineHeight: 1.08,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Explore the{" "}
            <em style={{ fontStyle: "normal", fontWeight: "bold" }}>collection.</em>
          </h2>
        </div>

        {/* Arrows */}
        <div style={{ display: "flex", gap: 10 }} className="showcase-arrows">
          {(["left", "right"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid rgba(195,149,41,0.3)",
                background: "none",
                color: "rgba(255,255,255,0.55)",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#C39529";
                (e.currentTarget as HTMLElement).style.color = "#C39529";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(195,149,41,0.3)";
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
              }}
            >
              {dir === "left" ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          width: "calc(100% - max(80px, calc((100vw - 1440px) / 2 + 80px)))",
          marginLeft: "max(80px, calc((100vw - 1440px) / 2 + 80px))",
          boxSizing: "border-box",
          paddingLeft: 0,
          paddingRight: 80,
          paddingBottom: 8,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="showcase-track"
      >
        {cars.map((car, i) => (
          <div
            key={i}
            onClick={() => setSelectedCar(car)}
            style={{
              minWidth: 320,
              height: 440,
              borderRadius: 14,
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
              cursor: "pointer",
            }}
            className="showcase-card"
          >
            <img
              src={car.img}
              alt={car.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.65s ease",
              }}
              className="showcase-card-img"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.96) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "28px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#C39529",
                    marginBottom: 6,
                  }}
                >
                  {car.year} · {car.category}
                </p>
                <p
                  style={{
                    fontFamily: "'Morpha', Georgia, serif",
                    fontWeight: 400,
                    fontSize: 22,
                    color: "white",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {car.name}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(195,149,41,0.12)",
                  border: "1px solid rgba(195,149,41,0.3)",
                  borderRadius: 4,
                  padding: "6px 12px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: 10,
                    color: "#C39529",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {car.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="showcase-view-all" style={{ textAlign: "center", marginTop: 52 }}>
        <a
          href="https://nordmotion.com/vehicles/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(195,149,41,0.25)",
            paddingBottom: 4,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
        >
          View All Vehicles →
        </a>
      </div>

      {selectedCar && <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />}

      <style>{`
        .showcase-track::-webkit-scrollbar { display: none; }
        .showcase-card:hover .showcase-card-img { transform: scale(1.05); }
        @media (max-width: 960px) {
          .showcase-section { padding: 72px 0 64px !important; }
          .showcase-header {
            padding: 0 var(--showcase-mobile-pad, 28px) !important;
            margin-bottom: 28px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
          .showcase-eyebrow { gap: 10px !important; margin-bottom: 14px !important; }
          .showcase-eyebrow span:first-child { font-size: 10px !important; }
          .showcase-eyebrow span:last-child { font-size: 9px !important; letter-spacing: 0.2em !important; }
          .showcase-title { font-size: 30px !important; line-height: 1.08 !important; margin: 0 !important; }
          .showcase-track {
            width: calc(100% - var(--showcase-mobile-pad, 28px)) !important;
            box-sizing: border-box !important;
            gap: 12px !important;
            margin-left: var(--showcase-mobile-pad, 28px) !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            padding-left: 0 !important;
            padding-right: 24px !important;
            scroll-snap-type: x proximity !important;
            touch-action: pan-x pan-y pinch-zoom !important;
            -webkit-overflow-scrolling: touch;
          }
          .showcase-card {
            flex: 0 0 74vw !important;
            width: 74vw !important;
            min-width: 0 !important;
            max-width: 270px !important;
            height: 290px !important;
            scroll-snap-align: start !important;
          }
          .showcase-arrows { display: none !important; }
          .showcase-view-all { margin-top: 32px !important; }
        }
      `}</style>
    </section>
  );
}
