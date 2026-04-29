import React from "react";

const items = [
  "30% Minimum Down Payment",
  "Four Tiers · One Intelligent System",
  "Powered by the Nord Credit Score",
  "Starting from ₦32.5M",
  "Up to 48 Months Tenure",
  "www.nordfinance.ng",
];

export function TickerStrip() {
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        backgroundColor: "#050505",
        borderTop: "1px solid rgba(195,149,41,0.12)",
        borderBottom: "1px solid rgba(195,149,41,0.12)",
        overflow: "hidden",
        height: 36,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          animation: "ticker 36s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
                padding: "0 10px",
              }}
            >
              {item}
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "rgba(195,149,41,0.5)",
                flexShrink: 0,
                marginRight: 4,
              }}
            />
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
