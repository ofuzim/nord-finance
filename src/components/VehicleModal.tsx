'use client'

import { useEffect, useState } from "react";
import type { Vehicle, VehicleIconType } from "@/lib/vehicleCatalog";
import busOutline from "../imports/bus-outline.svg";
import pickupOutline from "../imports/pick-up-outline.svg";
import sedanOutline from "../imports/sedan-outline.svg";
import suvOutline from "../imports/suv-outline.svg";
import tavetOutline from "../imports/tavet-outline.svg";

const vehicleIconSrc: Record<VehicleIconType, string> = {
  sedan: sedanOutline.src,
  coupe: sedanOutline.src,
  suv: suvOutline.src,
  pickup: pickupOutline.src,
  bus: busOutline.src,
  ev: tavetOutline.src,
  van: busOutline.src,
};

export function VehicleArtwork({ car, variant = "modal" }: { car: Vehicle; variant?: "modal" | "card" }) {
  if (car.img) {
    return (
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
        className={variant === "card" ? "showcase-card-img" : undefined}
      />
    );
  }

  return (
    <div
      className={variant === "card" ? "showcase-card-img" : undefined}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(195,149,41,0.62)",
        background:
          "radial-gradient(circle at 50% 42%, rgba(195,149,41,0.18), transparent 38%), linear-gradient(145deg, #121214 0%, #050506 100%)",
        transition: "transform 0.65s ease",
      }}
    >
      <img
        src={vehicleIconSrc[car.icon]}
        alt={`${car.category} outline`}
        width={460}
        height={170}
        style={{
          maxWidth: variant === "card" ? "88%" : "92%",
          height: "auto",
          objectFit: "contain",
          filter: "brightness(0) saturate(100%) invert(61%) sepia(57%) saturate(677%) hue-rotate(6deg) brightness(98%) contrast(95%)",
          opacity: 0.82,
        }}
      />
    </div>
  );
}

export function VehicleModal({ car, onClose }: { car: Vehicle; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const ctaLabel = car.site.includes("tavetmotion.com") ? "View on Tavet" : "View on Nord";

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 360);
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
        <div style={{ position: "relative", height: 420 }} className="car-modal-img-wrap">
          <VehicleArtwork car={car} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.92) 100%)",
          }} />
          <div className="car-modal-name-block" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px" }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C39529", marginBottom: 8 }}>
              {car.year} · {car.category}
            </p>
            <p style={{ fontFamily: "'Morpha', Georgia, serif", fontWeight: 400, fontSize: 34, color: "white", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {car.name}
            </p>
          </div>
        </div>

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
            {ctaLabel} →
          </a>
        </div>

        <button
          onClick={handleClose}
          aria-label="Close vehicle preview"
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
          from { opacity: 0; transform: scale(0.96) translateY(120px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes car-modal-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.96) translateY(120px); }
        }
        @keyframes car-name-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .car-modal-backdrop         { animation: car-backdrop-in 0.22s ease both; }
        .car-modal-backdrop.closing { animation: car-backdrop-out 0.18s ease 0.18s both; }
        .car-modal-inner            { animation: car-modal-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .car-modal-inner.closing    { animation: car-modal-out 0.24s cubic-bezier(0.55, 0, 1, 0.45) both; }
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
