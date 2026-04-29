'use client'

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { vehicleGroups, indicativePriceForModel } from "@/lib/vehicleCatalog";

const DEFAULT_CALC_MODEL = "Nord A5";

const TIERS = [
  {
    label: "Access Tier",
    rate: 0.28,
    display: "28%+ p.a.",
    rateLabel: "Access Tier",
    downPaymentRate: 0.3,
    tenures: [12, 24, 36, 48],
    portfolioNote: "Entry portfolio",
  },
  {
    label: "Core Tier",
    rate: 0.22,
    display: "22% p.a.",
    rateLabel: "Core Tier",
    downPaymentRate: 0.3,
    tenures: [12, 24, 36],
    portfolioNote: "Full vehicle range",
  },
  {
    label: "Premium Tier",
    rate: 0.18,
    display: "18% p.a.",
    rateLabel: "Premium Tier",
    downPaymentRate: 0.3,
    tenures: [12, 18],
    portfolioNote: "Premium vehicle selection",
  },
  {
    label: "Private Bridge",
    rate: 0.09,
    display: "9% p.a.",
    rateLabel: "Private Bridge Tier",
    downPaymentRate: 0.5,
    tenures: [6],
    portfolioNote: "Full luxury portfolio",
  },
];

function formatNaira(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

function calcMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export function LoanCalculator() {
  const [tierIdx, setTierIdx] = useState(0); // default: Access Tier
  const [selectedModel, setSelectedModel] = useState(DEFAULT_CALC_MODEL);
  const [tenure, setTenure] = useState(TIERS[0].tenures[0]);

  const selectedTier = TIERS[tierIdx];
  const vehiclePrice = indicativePriceForModel(selectedModel);
  const downPaymentRate = selectedTier.downPaymentRate;
  const loanRate = 1 - downPaymentRate;

  const monthly = useMemo(
    () => calcMonthlyPayment(vehiclePrice * loanRate, selectedTier.rate, tenure),
    [vehiclePrice, loanRate, tenure, selectedTier.rate]
  );

  const downPayment = vehiclePrice * downPaymentRate;
  const loanAmount = vehiclePrice * loanRate;

  const handleTierChange = (nextTierIdx: number) => {
    const nextTier = TIERS[nextTierIdx];
    setTierIdx(nextTierIdx);
    setTenure(nextTier.tenures[0]);
  };

  return (
    <section
      className="calc-section"
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
          display: "flex",
          gap: 60,
          alignItems: "center",
        }}
        className="calc-outer"
      >
        {/* Left — title + text */}
        <div style={{ flex: "0 0 50%", paddingTop: 8 }} className="calc-left">
          <div className="calc-eyebrow" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
            <span style={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 10,
              letterSpacing: "0.25em", textTransform: "uppercase", color: "#C39529",
            }}>
              Run the Numbers
            </span>
          </div>
          <h2 className="calc-title" style={{
            fontFamily: "'Morpha', Georgia, serif",
            fontWeight: 400, fontSize: "clamp(34px, 3.2vw, 54px)",
            lineHeight: 1.08, color: "white", letterSpacing: "-0.02em", marginBottom: 28,
          }}>
            Calculate your{" "}
            <em style={{ fontStyle: "normal", fontWeight: "bold" }}>monthly payment.</em>
          </h2>
          <p className="calc-description" style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: 14,
            lineHeight: 1.9, color: "var(--text-muted)", marginBottom: 40,
          }}>
            Choose your Nord Credit Score tier first, then select an eligible vehicle option and tenure to estimate your monthly repayment.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Selected Rate", value: selectedTier.display },
              { label: "Down Payment", value: `${Math.round(downPaymentRate * 100)}%` },
              { label: "Eligible Portfolio", value: selectedTier.portfolioNote },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: 12, color: "var(--text-faint)", letterSpacing: "0.04em" }}>{item.label}</span>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: "#C39529" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — calculator card */}
        <div style={{ flex: "0 0 50%" }}>
        {/* Card */}
        <div
          style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(195,149,41,0.15)",
            borderRadius: 16,
            padding: "52px 56px",
            position: "relative",
            overflow: "hidden",
          }}
          className="calc-card"
        >
          {/* Card inner glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: "#C39529",
              opacity: 0.5,
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginBottom: 24,
            }}
            className="calc-inputs"
          >
            {/* Tier */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  marginBottom: 10,
                }}
              >
                Tier
              </label>
              <select
                value={tierIdx}
                onChange={(e) => handleTierChange(Number(e.target.value))}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "white",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C39529' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C39529")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                {TIERS.map((tier, i) => (
                  <option key={tier.label} value={i}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Option */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  marginBottom: 10,
                }}
              >
                Eligible Vehicle Option
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "white",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C39529' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C39529")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                {vehicleGroups.map((group) => (
                  <optgroup key={group.category} label={group.category}>
                    {group.models.map((model) => (
                      <option key={model} value={model}>
                        {model} · {formatNaira(indicativePriceForModel(model))}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Tenure */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  marginBottom: 10,
                }}
              >
                Tenure
              </label>
              <select
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 15,
                  color: "white",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C39529' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#C39529")}
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                {selectedTier.tenures.map((month) => (
                  <option key={month} value={month}>
                    {month} {month === 1 ? "Month" : "Months"}
                  </option>
                ))}
              </select>
            </div>

            {/* Rate */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-faint)",
                  marginBottom: 10,
                }}
              >
                Rate
              </label>
              <div
                style={{
                  width: "100%",
                  backgroundColor: "rgba(195,149,41,0.06)",
                  border: "1px solid rgba(195,149,41,0.2)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#C39529",
                    lineHeight: 1.35,
                  }}
                >
                  {selectedTier.display}
                </span>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(195,149,41,0.5)",
                    textAlign: "right",
                    lineHeight: 1.35,
                  }}
                >
                  {selectedTier.rateLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
              marginBottom: 24,
            }}
          />

          {/* Breakdown row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
            className="calc-breakdown"
          >
            {[
              { label: `Down Payment (${Math.round(downPaymentRate * 100)}%)`, value: formatNaira(downPayment) },
              { label: `Loan Amount (${Math.round(loanRate * 100)}%)`, value: formatNaira(loanAmount) },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "16px 18px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: 10,
                    color: "var(--text-faint)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    color: "var(--text-muted)",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Output */}
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(195,149,41,0.25)",
              borderRadius: 12,
              padding: "32px",
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 10,
              }}
            >
              Estimated Monthly Payment
            </p>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(36px, 4.5vw, 56px)",
                color: "#C39529",
                lineHeight: 1,
              }}
            >
              {formatNaira(monthly)}
            </p>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: 10,
                color: "var(--text-muted)",
                marginTop: 10,
                letterSpacing: "0.04em",
              }}
            >
              * Estimate only. Actual rate depends on your Nord Credit Score tier.
            </p>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <Link
              href="/credit-score"
              style={{
                display: "inline-block",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#000",
                textDecoration: "none",
                backgroundColor: "#C39529",
                borderRadius: 100,
                padding: "15px 52px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#d4a730")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#C39529")
              }
            >
              Get Started
            </Link>
          </div>
        </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .calc-outer { flex-direction: column !important; padding: 0 40px !important; gap: 52px !important; }
          .calc-left { flex: 1 1 auto !important; padding-top: 0 !important; }
        }
        @media (max-width: 960px) {
          .calc-section { padding: 72px 0 !important; }
          .calc-outer { padding: 0 28px !important; gap: 32px !important; }
          .calc-eyebrow { gap: 10px !important; margin-bottom: 14px !important; }
          .calc-eyebrow span:first-child { font-size: 10px !important; }
          .calc-eyebrow span:last-child { font-size: 9px !important; letter-spacing: 0.2em !important; }
          .calc-title { font-size: 30px !important; line-height: 1.08 !important; margin-bottom: 16px !important; }
          .calc-description { font-size: 13px !important; line-height: 1.75 !important; margin-bottom: 24px !important; }
        }
        @media (max-width: 768px) {
          .calc-outer { padding: 0 24px !important; gap: 28px !important; }
          .calc-card { padding: 32px 24px !important; }
          .calc-inputs { grid-template-columns: 1fr !important; }
          .calc-breakdown { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
