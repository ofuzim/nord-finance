'use client'

import React from "react";
import Link from "next/link";
import { Instagram, type LucideIcon } from "lucide-react";
import { NordFinanceLogo } from "./NordFinanceLogo";

function XLogo({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path d="M16.02 4C9.42 4 4.05 9.35 4.05 15.93c0 2.12.56 4.19 1.63 6.02L4 28l6.23-1.63a11.96 11.96 0 0 0 5.79 1.47h.01c6.59 0 11.96-5.35 11.96-11.93C27.99 9.35 22.62 4 16.02 4Zm0 21.82h-.01a9.93 9.93 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.23-.37a9.86 9.86 0 0 1-1.51-5.3c0-5.46 4.43-9.9 9.88-9.9 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.89 6.99c-.01 5.46-4.44 9.9-9.89 9.9Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.1 4.52.71.31 1.27.49 1.71.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

const socialItems: readonly {
  href: string;
  label: string;
  Icon?: LucideIcon;
  render?: () => React.ReactNode;
  external?: boolean;
}[] = [
  { href: "https://wa.me/2348149799150", label: "WhatsApp", render: () => <WhatsAppLogo size={19} />, external: true },
  { href: "#", label: "Instagram", Icon: Instagram },
  { href: "#", label: "X", render: () => <XLogo size={14} /> },
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
    label: "Plot 14, Adebisi Ogunniyi Crescent, Lekki-Epe Expressway, Lekki, Lagos.",
    href:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Plot 14, Adebisi Ogunniyi Crescent, Lekki-Epe Expressway, Lekki, Lagos"),
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
              className="footer-brand-desc"
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
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
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
          .footer-brand-desc { max-width: 100% !important; font-size: 14px !important; line-height: 1.8 !important; color: rgba(255,255,255,0.72) !important; }
          .footer-grid a { font-size: 14px !important; color: rgba(255,255,255,0.72) !important; }
          .footer-bottom { flex-direction: column !important; gap: 8px; text-align: center; }
          .footer-bottom p { font-size: 12px !important; color: rgba(255,255,255,0.4) !important; }
        }
      `}</style>
    </footer>
  );
}
