'use client'

import React, { useState } from "react";

const faqs = [
  {
    q: "What makes Nord Finance different from a traditional bank car loan?",
    a: "Nord Finance is a structured credit system — not a bank. We use the proprietary Nord Credit Score to match you to the exact tier, rate, and vehicle range you qualify for. You see your score, rate, and payment before you commit.",
  },
  {
    q: "How is the Nord Credit Score calculated?",
    a: "Your score is determined by five weighted factors: income consistency, financial obligations, credit history, employment status, and asset profile. Your final score places you in one of four financing tiers.",
  },
  {
    q: "What is the minimum down payment required?",
    a: "All tiers require a minimum 30% down payment. Private Bridge clients may negotiate custom terms with their dedicated relationship manager.",
  },
  {
    q: "Can I finance a fairly used (pre-owned) vehicle?",
    a: "Yes. Nord Finance covers both new and certified pre-owned vehicles within the Nord Automobiles portfolio, subject to age, mileage, and condition standards.",
  },
  {
    q: "How long does the approval process take?",
    a: "Credit Score assessment is completed within 24 hours. Full approval and disbursement typically follows within 5–7 business days. Premium and Private Bridge clients receive priority processing.",
  },
  {
    q: "What if I don't qualify for my preferred tier?",
    a: "We don't just decline — we explain. Your relationship manager will walk you through what to address and the timeline to move up. Clients have achieved tier upgrades in as little as 90 days.",
  },
];

function AccordionItem({
  faq, index, open, onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  open: number | null;
  onToggle: (i: number) => void;
}) {
  const isOpen = open === index;
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.18)" }}>
      <button
        onClick={() => onToggle(index)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "18px 0",
          background: "none", border: "none", cursor: "pointer", gap: 20, textAlign: "left",
        }}
      >
        <span className="faq-question" style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15,
          color: isOpen ? "#C39529" : "white",
          lineHeight: 1.5, transition: "color 0.2s ease",
        }}>
          {faq.q}
        </span>
        <span style={{
          width: 26, height: 26, borderRadius: "50%",
          border: `1px solid ${isOpen ? "#C39529" : "var(--text-muted)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: isOpen ? "#C39529" : "var(--text-muted)",
          fontSize: 16, fontWeight: 300, lineHeight: 1, transition: "all 0.2s ease",
        }}>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div style={{ paddingBottom: 18, paddingRight: 46 }}>
          <p style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 300,
            fontSize: 13, lineHeight: 1.85, color: "var(--text-muted)",
          }}>
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}

export function FAQ({
  compactTop = false,
  hideResourcesLink = false,
  compactBottom = false,
}: {
  compactTop?: boolean;
  hideResourcesLink?: boolean;
  compactBottom?: boolean;
} = {}) {
  const [open, setOpen] = useState<number | null>(0);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  const left  = faqs.slice(0, 3);
  const right = faqs.slice(3, 6);

  return (
    <section
      className="faq-section"
      style={{
        backgroundColor: "#000",
        padding: compactTop || compactBottom ? `${compactTop ? 72 : 140}px 0 ${compactBottom ? 72 : 140}px` : "140px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(195,149,41,0.3) 30%, rgba(195,149,41,0.3) 70%, transparent)",
      }} />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 80px", position: "relative", zIndex: 1 }} className="faq-outer">

        {/* Header — title left, text right (same as WhatIsNord) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, gap: 60 }} className="faq-header">
          <div>
            <div className="faq-eyebrow" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <span style={{ color: "#C39529", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12 }}>//</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C39529" }}>
                Resources & FAQ
              </span>
            </div>
            <h2 className="faq-title" style={{
              fontFamily: "'Morpha', Georgia, serif",
              fontWeight: 400, fontSize: "clamp(34px, 3.4vw, 54px)",
              lineHeight: 1.08, color: "white", letterSpacing: "-0.02em",
            }}>
              Everything you need to{" "}
              <br />
              <em style={{ fontStyle: "normal", fontWeight: "bold" }}>move forward.</em>
            </h2>
          </div>
          <p style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: 14,
            lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 360, textAlign: "right",
          }} className="faq-sub">
            Common questions about how Nord Finance works, plus tools and resources to help you plan your financing journey.
          </p>
        </div>

        {/* FAQ — 2-col accordion */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px", marginBottom: 72 }} className="faq-grid">
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}>
            {left.map((faq, i) => (
              <AccordionItem key={i} faq={faq} index={i} open={open} onToggle={toggle} />
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}>
            {right.map((faq, i) => (
              <AccordionItem key={i + 3} faq={faq} index={i + 3} open={open} onToggle={toggle} />
            ))}
          </div>
        </div>

        {!hideResourcesLink && (
          <div style={{ textAlign: "center" }}>
            <a
              href="/finance-assets"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)", textDecoration: "none",
                borderBottom: "1px solid rgba(195,149,41,0.25)", paddingBottom: 4,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              View Finance Assets & Resources →
            </a>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .faq-outer { padding: 0 40px !important; }
          .faq-header { flex-direction: column !important; align-items: flex-start !important; }
          .faq-sub { text-align: left !important; max-width: 100% !important; }
        }
        @media (max-width: 960px) {
          .faq-section { padding: 72px 0 !important; }
          .faq-outer { padding: 0 28px !important; }
          .faq-header { gap: 12px !important; margin-bottom: 32px !important; }
          .faq-eyebrow { gap: 10px !important; margin-bottom: 14px !important; }
          .faq-eyebrow span:first-child { font-size: 10px !important; }
          .faq-eyebrow span:last-child { font-size: 9px !important; letter-spacing: 0.2em !important; }
          .faq-title { font-size: 30px !important; line-height: 1.08 !important; margin: 0 !important; }
          .faq-sub { font-size: 13px !important; line-height: 1.75 !important; margin: 0 !important; }
          .faq-question { font-size: 15px !important; line-height: 1.45 !important; }
          .faq-grid { margin-bottom: 44px !important; }
        }
        @media (max-width: 768px) {
          .faq-outer { padding: 0 24px !important; }
          .faq-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
        }
      `}</style>
    </section>
  );
}
