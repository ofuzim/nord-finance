'use client'

import React from "react";
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

export function FinanceAssetsPage() {
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
                margin: 0,
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
              marginTop: 0,
              marginBottom: 0,
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
            padding: "72px 80px 72px",
          }}
          className="finance-assets-shell"
        >
          <div>
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
          }
          @media (max-width: 700px) {
            .finance-assets-hero,
            .finance-assets-shell {
              padding-left: 24px !important;
              padding-right: 24px !important;
            }
            .resource-category-grid {
              grid-template-columns: 1fr !important;
            }
            .finance-assets-hero-copy {
              font-size: 15px !important;
              line-height: 1.85 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            .finance-assets-hero {
              gap: 24px !important;
              padding-top: 72px !important;
              padding-bottom: 48px !important;
            }
          }
        `}</style>
    </main>
  );
}
