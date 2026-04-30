'use client'

import React, { useState } from "react";
import { FileText, LockKeyhole, Search, ShieldCheck } from "lucide-react";

const resourceCategories = [
  {
    title: "Application Forms",
    desc: "Downloadable forms for KYC, vehicle finance requests, and supporting declarations.",
    icon: FileText,
  },
  {
    title: "Guides & Checklists",
    desc: "Step-by-step documents to help you prepare before starting your finance journey.",
    icon: Search,
  },
  {
    title: "Policies & Terms",
    desc: "Helpful legal, privacy, and financing documents for review before submission.",
    icon: ShieldCheck,
  },
  {
    title: "Secure Uploads",
    desc: "Document upload instructions and approved formats for future application support.",
    icon: LockKeyhole,
  },
];

const financeAssetFaqs = [
  {
    q: "What will be available on this page?",
    a: "This page will host Nord Finance forms, checklists, policy documents, financing guides, and other resources that support your application journey.",
  },
  {
    q: "Are any documents available for download right now?",
    a: "Not yet. The structure is ready, but downloadable resources will be added once the current versions are approved and published.",
  },
  {
    q: "Do I need these resources before checking my score?",
    a: "No. You can begin with the Nord Credit Score assessment first. Resources are mainly here to help you prepare for the full application and document review.",
  },
  {
    q: "What documents should I generally prepare?",
    a: "Typical requirements include a government-issued ID, passport photograph, BVN/NIN details, proof of income, proof of residence, and vehicle preference details.",
  },
  {
    q: "Can I submit an application without downloading forms?",
    a: "Yes. The primary application flow is digital. Downloadable assets are supplementary and will be useful for reference, offline review, or special cases.",
  },
  {
    q: "How do I know when resources are added?",
    a: "This page will be updated as resources become available. You can also contact Nord Finance on WhatsApp if you need a specific document.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <span style={{ color: "#C39529", fontWeight: 700, fontSize: 12 }}>//</span>
      <span
        style={{
          color: "#C39529",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function FaqItem({
  faq,
  index,
  open,
  setOpen,
}: {
  faq: { q: string; a: string };
  index: number;
  open: number | null;
  setOpen: (value: number | null) => void;
}) {
  const isOpen = open === index;

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        type="button"
        onClick={() => setOpen(isOpen ? null : index)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          padding: "20px 0",
          border: "none",
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            color: isOpen ? "#fff" : "rgba(255,255,255,0.62)",
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {faq.q}
        </span>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: `1px solid ${isOpen ? "#C39529" : "rgba(255,255,255,0.12)"}`,
            color: isOpen ? "#C39529" : "rgba(255,255,255,0.34)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 18,
            fontWeight: 300,
          }}
        >
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            fontWeight: 300,
            lineHeight: 1.85,
            margin: "0 48px 20px 0",
          }}
        >
          {faq.a}
        </p>
      )}
    </div>
  );
}

export function FinanceAssetsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main style={{ paddingTop: 72, backgroundColor: "#000" }}>
      <section
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at 16% 18%, rgba(195,149,41,0.14), transparent 30%), linear-gradient(180deg, #111 0%, #050505 100%)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "96px 80px 78px",
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 72,
            alignItems: "end",
          }}
          className="finance-assets-hero"
        >
          <div>
            <SectionLabel>Finance Assets</SectionLabel>
            <h1
              style={{
                fontFamily: "'Morpha', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(44px, 5vw, 78px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: "#fff",
                maxWidth: 760,
              }}
            >
              Forms, resources, <br />
              and <em style={{ fontStyle: "normal", fontWeight: "bold" }}>guidance.</em>
            </h1>
          </div>
          <p
            className="finance-assets-hero-copy"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.9,
              maxWidth: 420,
              marginLeft: "auto",
            }}
          >
            A central library for Nord Finance documents, application resources, and guidance. Downloads will appear here once approved resources are available.
          </p>
        </div>
      </section>

      <section>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "82px 80px 120px",
          }}
          className="finance-assets-shell"
        >
          <div style={{ marginBottom: 104 }}>
            <SectionLabel>Resource Categories</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="resource-category-grid">
              {resourceCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.title}
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 18,
                      padding: "26px 24px",
                      backgroundColor: "rgba(255,255,255,0.035)",
                      minHeight: 220,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Icon size={24} color="#C39529" style={{ marginBottom: 24 }} />
                    <p style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>{category.title}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.75, margin: 0, flex: 1 }}>{category.desc}</p>
                    <span
                      style={{
                        marginTop: 24,
                        color: "rgba(255,255,255,0.32)",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 48,
                marginBottom: 56,
              }}
              className="finance-assets-faq-header"
            >
              <div>
                <SectionLabel>Resources FAQ</SectionLabel>
                <h2
                  style={{
                    fontFamily: "'Morpha', Georgia, serif", fontWeight: 400,
                    fontSize: "clamp(34px, 3.4vw, 54px)",
                    lineHeight: 1.08,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Everything you need to <br />
                  <em style={{ fontStyle: "normal", fontWeight: "bold" }}>move forward.</em>
                </h2>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.8, maxWidth: 380, textAlign: "right", margin: 0 }} className="finance-assets-faq-copy">
                Common questions about how Nord Finance works, plus tools and resources to help you plan your financing journey.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }} className="finance-assets-faq-grid">
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {financeAssetFaqs.slice(0, 3).map((faq, index) => (
                  <FaqItem key={faq.q} faq={faq} index={index} open={open} setOpen={setOpen} />
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {financeAssetFaqs.slice(3).map((faq, index) => (
                  <FaqItem key={faq.q} faq={faq} index={index + 3} open={open} setOpen={setOpen} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
          @media (max-width: 1100px) {
            .finance-assets-hero,
            .finance-assets-shell {
              padding-left: 40px !important;
              padding-right: 40px !important;
            }
            .finance-assets-hero {
              grid-template-columns: 1fr !important;
            }
            .resource-category-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .finance-assets-faq-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            .finance-assets-faq-copy {
              text-align: left !important;
              max-width: 100% !important;
            }
          }
          @media (max-width: 700px) {
            .finance-assets-hero,
            .finance-assets-shell {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .resource-category-grid,
            .finance-assets-faq-grid {
              grid-template-columns: 1fr !important;
            }
            .finance-assets-hero-copy {
              font-size: 15px !important;
              line-height: 1.85 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
          }
        `}</style>
    </main>
  );
}
