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
            <span className="ticker-item"
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
            <span className="ticker-dot" />
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-dot {
          display: block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          background-color: rgba(195,149,41,0.5);
          flex-shrink: 0;
          margin-right: 4px;
          line-height: 0;
          font-size: 0;
          /* Promote to own compositing layer — fixes iOS Safari border-radius
             disappearing inside CSS-animated (translateX) containers */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        @media (max-width: 768px) {
          .ticker-item { padding: 0 4px !important; }
          .ticker-dot  { width: 2px !important; height: 2px !important; margin-right: 2px !important; }
        }
      `}</style>
    </div>
  );
}
