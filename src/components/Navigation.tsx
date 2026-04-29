'use client'

import React, { useState, useEffect, useRef } from "react";
import { ArrowUp, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NordFinanceLogo } from "./NordFinanceLogo";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pendingHomeTopRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const applyDisabled = pathname.startsWith("/application") || pathname.startsWith("/credit-score");

  const closeMenu = () => {
    const toggle = document.getElementById("nav-toggle") as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return false;
    const headerOffset = 72;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.history.pushState(null, "", `/#${sectionId}`);
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);
      setShowBackToTop(currentScrollY > 300 && currentScrollY < lastScrollYRef.current);
      lastScrollYRef.current = currentScrollY;
    };
    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    if (pendingHomeTopRef.current) {
      pendingHomeTopRef.current = false;
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (window.location.hash === "#plans") {
      window.setTimeout(() => scrollToSection("plans"), 80);
    }
    const updateActiveSection = () => {
      const plans = document.getElementById("plans");
      if (!plans) {
        setActiveSection(window.location.hash === "#plans" ? "plans" : "");
        return;
      }
      const rect = plans.getBoundingClientRect();
      const headerOffset = 72;
      const isPlansActive = rect.top <= headerOffset && rect.bottom > headerOffset;
      setActiveSection(isPlansActive ? "plans" : "");
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/", home: true },
    { label: "Products", href: "/#plans", section: "plans" },
    { label: "Credit Score", href: "/credit-score" },
    { label: "Finance Assets", href: "/finance-assets" },
    { label: "Nord Automobiles", href: "https://nordmotion.com/", external: true },
    { label: "Contact Us", href: "https://wa.me/2348149799150", external: true },
  ];

  const navLinkIsActive = (link: (typeof navLinks)[number]) => {
    if ("home" in link && link.home) return pathname === "/" && activeSection !== "plans";
    if (link.section) return pathname === "/" && activeSection === link.section;
    if (link.href === "/" || link.external) return false;
    return pathname.startsWith(link.href);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[number]) => {
    closeMenu();

    if ("home" in link && link.home) {
      event.preventDefault();
      if (pathname !== "/") {
        pendingHomeTopRef.current = true;
        router.push("/", { scroll: false });
      } else {
        window.history.replaceState(null, "", "/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (!link.section) return;

    event.preventDefault();

    if (pathname === "/") {
      scrollToSection(link.section);
      return;
    }

    router.push(link.href, { scroll: false });
    window.setTimeout(() => scrollToSection(link.section), 120);
  };

  const handleBackToTop = () => {
    if (pathname === "/") window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hidden checkbox — CSS-only mobile menu toggle, survives HMR */}
      <input type="checkbox" id="nav-toggle" aria-hidden="true" />

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          backgroundColor: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
        }}
      >
        <div
          className="nav-inner"
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, navLinks[0])}
            style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <NordFinanceLogo height={42} />
          </Link>

          {/* Center nav links — hidden on mobile */}
          <div className="nav-links" style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {navLinks.map((link) => {
              const isActive = navLinkIsActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isActive ? "#C39529" : "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#C39529" : "rgba(255,255,255,0.8)")}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/credit-score"
              className="nav-apply"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: applyDisabled ? "rgba(255,255,255,0.3)" : "#000",
                textDecoration: "none",
                backgroundColor: applyDisabled ? "rgba(255,255,255,0.1)" : "#C39529",
                borderRadius: 100,
                padding: "9px 22px",
                transition: "all 0.2s ease",
                cursor: applyDisabled ? "default" : "pointer",
                pointerEvents: applyDisabled ? "none" : "auto",
              }}
              onMouseEnter={(e) => { if (!applyDisabled) (e.currentTarget.style.backgroundColor = "#d4a730"); }}
              onMouseLeave={(e) => { if (!applyDisabled) (e.currentTarget.style.backgroundColor = "#C39529"); }}
            >
              Apply Now
            </Link>

            {/* Hamburger label — toggles checkbox, mobile only */}
            <label
              htmlFor="nav-toggle"
              className="nav-hamburger"
              aria-label="Open navigation menu"
              style={{
                color: "white",
                cursor: "pointer",
                padding: 8,
                lineHeight: 0,
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                userSelect: "none",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </label>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay — always in DOM, shown via CSS when checkbox is checked */}
      <div
        className="mobile-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          backgroundColor: "#000",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap:24,
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <label
          htmlFor="nav-toggle"
          aria-label="Close navigation menu"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            color: "white",
            cursor: "pointer",
            lineHeight: 0,
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            userSelect: "none",
          }}
        >
          <X size={28} />
        </label>

        <div style={{ marginBottom: 20 }}>
          <NordFinanceLogo height={60} />
        </div>

        {navLinks.map((link) => {
          const isActive = navLinkIsActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isActive ? "#C39529" : "white",
                textDecoration: "none",
                transition: "color 0.2s ease",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#C39529" : "white")}
            >
              {link.label}
            </Link>
          );
        })}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", marginTop: 8 }}>
          <Link
            href="/credit-score"
            onClick={closeMenu}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: applyDisabled ? "rgba(255,255,255,0.3)" : "#000",
              textDecoration: "none",
              backgroundColor: applyDisabled ? "rgba(255,255,255,0.1)" : "#C39529",
              borderRadius: 100,
              padding: "11px 36px",
              pointerEvents: applyDisabled ? "none" : "auto",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Apply Now
          </Link>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 28, alignItems: "center", justifyContent: "center", marginTop: 16 }}>
            {[
              {
                href: "#", label: "Instagram",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                ),
              },
              {
                href: "#", label: "X",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 1200 1227" fill="currentColor">
                    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z" />
                  </svg>
                ),
              },
              {
                href: "#", label: "LinkedIn",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ),
              },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  color: "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s ease",
                  WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      <button
        type="button"
        aria-label="Back to top"
        onClick={handleBackToTop}
        style={{
          position: "fixed",
          right: 28,
          bottom: 28,
          zIndex: 150,
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.22)",
          backgroundColor: "rgba(18,18,20,0.75)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          color: "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 16px 35px rgba(0,0,0,0.35)",
          opacity: showBackToTop ? 1 : 0,
          pointerEvents: showBackToTop ? "auto" : "none",
          transform: showBackToTop ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "rgba(32,32,34,0.88)";
          el.style.borderColor = "rgba(255,255,255,0.32)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "rgba(18,18,20,0.75)";
          el.style.borderColor = "rgba(255,255,255,0.22)";
        }}
      >
        <ArrowUp size={20} />
      </button>

      <style>{`
        #nav-toggle { display: none; }
        .mobile-overlay { display: none; }
        .nav-hamburger { display: none; }

        @media (max-width: 768px) {
          .nav-inner { padding: 0 24px !important; }
          .nav-links { display: none !important; }
          .nav-apply { display: none !important; }
          .nav-hamburger { display: flex !important; align-items: center; justify-content: center; }
          #nav-toggle:checked ~ .mobile-overlay { display: flex !important; }
        }
      `}</style>
    </>
  );
}
