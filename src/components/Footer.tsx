'use client'

import React from "react";
import Link from "next/link";
import { Instagram, Linkedin, type LucideIcon } from "lucide-react";
import { NordFinanceLogo } from "./NordFinanceLogo";

function XLogo({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialItems: readonly {
  href: string;
  label: string;
  Icon?: LucideIcon;
  render?: () => React.ReactNode;
}[] = [
  { href: "#", label: "Instagram", Icon: Instagram },
  { href: "#", label: "X", render: () => <XLogo size={15} /> },
  { href: "#", label: "LinkedIn", Icon: Linkedin },
];

const productLinks = [
  { label: "Vehicle Finance", href: "/#plans" },
  { label: "Nord Credit Score", href: "/credit-score" },
  { label: "Product Tiers", href: "/#plans" },
  { label: "Apply Now", href: "/credit-score" },
];
const companyLinks = [
  { label: "About Nord Finance", href: "/#learn-more" },
  { label: "Nord Automobiles", href: "https://nordmotion.com/", external: true },
  { label: "Finance Assets", href: "/finance-assets" },
  { label: "Legal & Terms", href: "/finance-assets" },
];

const contactItems = [
  { label: "hello@nordfinance.ng", href: "mailto:hello@nordfinance.ng" },
  { label: "0814 979 9150", href: "https://wa.me/2348149799150", external: true },
  {
    label: "4 Adebisi Ogunniyi Cres, Lekki Phase I, Lekki 106104, Lagos",
    href:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("4 Adebisi Ogunniyi Cres, Lekki Phase I, Lekki 106104, Lagos"),
    external: true,
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#000",
        borderTop: "1px solid #C39529",
        paddingTop: 64,
        paddingBottom: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 80px",
        }}
        className="footer-container"
      >
        {/* Four columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1.5fr",
            gap: 60,
            paddingBottom: 56,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <NordFinanceLogo height={52} />
            </div>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.45)",
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              Structured vehicle credit infrastructure for the Nigerian premium
              automobile market. Intelligence. Transparency. Aspiration.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {socialItems.map((item) => {
                const Icon = item.Icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#C39529";
                      (e.currentTarget as HTMLElement).style.color = "#C39529";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                    }}
                  >
                    {item.render ? item.render() : Icon ? <Icon size={15} /> : null}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C39529",
                marginBottom: 20,
              }}
            >
              Products
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C39529",
                marginBottom: 20,
              }}
            >
              Company
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C39529",
                marginBottom: 20,
              }}
            >
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {contactItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="footer-bottom"
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            © {currentYear} Nord Finance. All Rights Reserved.
          </p>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.06em",
            }}
          >
            A Subsidiary of Nord Automobiles Limited
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .footer-container { padding: 0 40px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 600px) {
          .footer-container { padding: 0 24px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
