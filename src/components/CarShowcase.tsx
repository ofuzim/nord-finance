'use client'

import React, { useEffect, useRef, useState } from "react";
import { vehicles, type Vehicle } from "@/lib/vehicleCatalog";
import { VehicleArtwork, VehicleModal } from "./VehicleModal";

const COLLECTION_LIMIT = 8;

function randomSample<T>(items: T[], limit: number): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit);
}

export function CarShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collectionCars, setCollectionCars] = useState(() => vehicles.slice(0, COLLECTION_LIMIT));
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

  useEffect(() => {
    setCollectionCars(randomSample(vehicles, COLLECTION_LIMIT));
  }, []);

  const scroll = (dir: "left" | "right") => {
    const track = scrollRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || "0");
    const itemWidth = firstCard.getBoundingClientRect().width + gap;
    track.scrollBy({ left: dir === "right" ? itemWidth : -itemWidth, behavior: "smooth" });
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
            <em style={{ fontStyle: "normal", fontWeight: "bold" }}>lineup.</em>
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
        {collectionCars.map((car) => (
          <div
            key={car.name}
            onClick={() => setSelectedCar(car)}
            style={{
              width: 320,
              minWidth: 320,
              maxWidth: 320,
              height: 440,
              borderRadius: 14,
              overflow: "hidden",
              position: "relative",
              flex: "0 0 320px",
              cursor: "pointer",
              transition: "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), max-width 0.35s cubic-bezier(0.22, 1, 0.36, 1), flex-basis 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: "0.16s",
            }}
            className="showcase-card"
          >
            <VehicleArtwork car={car} variant="card" />
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
                    fontSize: 9,
                    color: "#C39529",
                    letterSpacing: "0.05em",
                    whiteSpace: "normal",
                    lineHeight: 1.35,
                    textAlign: "right",
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

      {selectedCar && <VehicleModal car={selectedCar} onClose={() => setSelectedCar(null)} />}

      <style>{`
        .showcase-track::-webkit-scrollbar { display: none; }
        .showcase-card:hover {
          width: 520px !important;
          max-width: 520px !important;
          flex-basis: 520px !important;
          transition-delay: 0.16s !important;
        }
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
            scroll-snap-type: x mandatory !important;
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
            scroll-snap-stop: always !important;
          }
          .showcase-card:hover {
            width: 74vw !important;
            max-width: 270px !important;
            flex-basis: 74vw !important;
          }
          .showcase-arrows { display: none !important; }
          .showcase-view-all { margin-top: 32px !important; }
        }
      `}</style>
    </section>
  );
}
