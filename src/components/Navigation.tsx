'use client'

import React, { useCallback, useState, useEffect, useRef } from "react";
import { ArrowUp, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NordFinanceLogo } from "./NordFinanceLogo";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileVehiclesOpen, setMobileVehiclesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lastScrollYRef = useRef(0);
  const applyDisabled = pathname.startsWith("/application") || pathname.startsWith("/credit-score");

  const closeMenu = useCallback(() => {
    const toggle = document.getElementById("nav-toggle") as HTMLInputElement | null;
    if (toggle) toggle.checked = false;
    setMobileVehiclesOpen(false);
  }, []);

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
    if (window.location.hash === "#plans") {
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
    { label: "Vehicles", dropdown: "vehicles" },
    { label: "Contact Us", href: "https://wa.me/2348149799150", external: true },
  ];

  const vehicleLinks = [
    { label: "Nord Motion", href: "https://nordmotion.com/" },
    { label: "Tavet Motion", href: "https://www.tavetmotion.com/" },
  ];

  const navLinkIsActive = (link: (typeof navLinks)[number]) => {
    if ("dropdown" in link) return false;
    if ("home" in link && link.home) return pathname === "/" && activeSection !== "plans";
    if (link.section) return pathname === "/" && activeSection === link.section;
    if (link.href === "/" || link.external) return false;
    return pathname.startsWith(link.href);
  };

  const navigateDocument = (href: string) => {
    closeMenu();
    window.sessionStorage.setItem(
      `nord-scroll:${pathname}`,
      JSON.stringify({ x: window.scrollX, y: window.scrollY })
    );
    router.push(href);
  };

  // Close menu when pathname changes — covers all cross-page navigation.
  useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  useEffect(() => {
    window.addEventListener("pagehide", closeMenu);
    window.addEventListener("pageshow", closeMenu);
    window.addEventListener("popstate", closeMenu);

    return () => {
      window.removeEventListener("pagehide", closeMenu);
      window.removeEventListener("pageshow", closeMenu);
      window.removeEventListener("popstate", closeMenu);
    };
  }, [closeMenu]);

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number],
  ) => {
    if ("dropdown" in link) {
      event.preventDefault();
      return;
    }

    // External links open in new tab — pathname never changes, so close immediately
    if (link.external) {
      closeMenu();
      return;
    }

    if ("home" in link && link.home) {
      if (pathname === "/") {
        // Already home — close and scroll to top immediately
        closeMenu();
        event.preventDefault();
        window.history.replaceState(null, "", "/");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      event.preventDefault();
      navigateDocument("/");
      return;
    }

    if (!link.section) {
      event.preventDefault();
      navigateDocument(link.href);
      return;
    }

    if (pathname === "/") {
      // Same-page section scroll — close immediately
      event.preventDefault();
      closeMenu();
      scrollToSection(link.section);
      return;
    }

    event.preventDefault();
    navigateDocument(link.href);
  };

  const handleBackToTop = () => {
    if (pathname === "/") window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hidden checkbox — CSS-only mobile menu toggle, survives HMR */}
      <input type="checkbox" id="nav-toggle" aria-hidden="true" autoComplete="off" />

      <nav
        className="site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          backgroundColor: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
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
            prefetch={false}
            onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, navLinks[0])}
            style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <NordFinanceLogo height={42} />
          </Link>

          {/* Center nav links — hidden on mobile */}
          <div className="nav-links" style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {navLinks.map((link) => {
              const isActive = navLinkIsActive(link);
              if ("dropdown" in link) {
                return (
                  <div key={link.label} className="nav-dropdown">
                    <button
                      type="button"
                      className="nav-dropdown-trigger"
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {link.label}
                      <ChevronDown size={13} strokeWidth={2} />
                    </button>
                    <div className="nav-dropdown-menu">
                      {vehicleLinks.map((vehicle) => (
                        <a
                          key={vehicle.href}
                          href={vehicle.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={closeMenu}
                          className="nav-dropdown-item"
                        >
                          {vehicle.label}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={link.external ? undefined : false}
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
              prefetch={false}
              className="nav-apply"
              onClick={(event) => {
                event.preventDefault();
                if (!applyDisabled) navigateDocument("/credit-score");
              }}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 13,
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
          display: "none",
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
          if ("dropdown" in link) {
            return (
              <div
                key={link.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: mobileVehiclesOpen ? 14 : 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => setMobileVehiclesOpen((open) => !open)}
                  style={{
                    fontFamily: "'Morpha', Georgia, serif",
                    fontSize: 32,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    color: mobileVehiclesOpen ? "#C39529" : "white",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span style={{ fontWeight: 400 }}>{link.label}</span>
                  <ChevronDown
                    size={24}
                    strokeWidth={1.5}
                    style={{
                      transform: mobileVehiclesOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
                {mobileVehiclesOpen && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                    {vehicleLinks.map((vehicle) => (
                      <a
                        key={vehicle.href}
                        href={vehicle.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={closeMenu}
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          fontSize: 13,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.64)",
                          textDecoration: "none",
                        }}
                      >
                        {vehicle.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={link.external ? undefined : false}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                fontFamily: "'Morpha', Georgia, serif",
                fontSize:32,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: isActive ? "#C39529" : "white",
                textDecoration: "none",
                transition: "color 0.2s ease",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C39529")}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#C39529" : "white")}
            >
              <span style={{ fontWeight: 400 }}>{link.label}</span>
            </Link>
          );
        })}

        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", marginTop: 8 }}>
          <Link
            href="/credit-score"
            prefetch={false}
            onClick={(event) => {
              event.preventDefault();
              if (!applyDisabled) navigateDocument("/credit-score");
            }}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: applyDisabled ? "rgba(255,255,255,0.3)" : "#000",
              textDecoration: "none",
              backgroundColor: applyDisabled ? "rgba(255,255,255,0.1)" : "#C39529",
              borderRadius: 100,
              padding: "12px 38px",
              pointerEvents: applyDisabled ? "none" : "auto",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Apply Now
          </Link>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 28, alignItems: "center", justifyContent: "center", marginTop: 28 }}>
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
        className="back-to-top"
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
          "--back-top-y": showBackToTop ? "0" : "12px",
          opacity: showBackToTop ? 1 : 0,
          pointerEvents: showBackToTop ? "auto" : "none",
          transform: "translateY(var(--back-top-y))",
          transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
        } as React.CSSProperties}
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
        .nav-dropdown {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 22px 0;
        }
        .nav-dropdown-trigger:hover,
        .nav-dropdown:focus-within .nav-dropdown-trigger,
        .nav-dropdown:hover .nav-dropdown-trigger {
          color: #C39529 !important;
        }
        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% - 10px);
          left: 50%;
          min-width: 208px;
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 18px 42px rgba(0,0,0,0.38);
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, 8px);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .nav-dropdown:hover .nav-dropdown-menu,
        .nav-dropdown:focus-within .nav-dropdown-menu {
          opacity: 1;
          pointer-events: auto;
          transform: translate(-50%, 0);
        }
        .nav-dropdown-item {
          display: block;
          padding: 13px 16px;
          border-radius: 6px;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.18s ease, background-color 0.18s ease;
        }
        .nav-dropdown-item:hover,
        .nav-dropdown-item:focus {
          color: #C39529;
          background: rgba(255,255,255,0.06);
          outline: none;
        }

        @media (max-width: 768px) {
          .site-nav {
            background-color: rgba(0,0,0,0.62) !important;
            backdrop-filter: blur(22px) saturate(1.2) !important;
            -webkit-backdrop-filter: blur(22px) saturate(1.2) !important;
            border-bottom: 1px solid transparent !important;
          }
          .nav-inner { padding: 0 24px !important; }
          .nav-links { display: none !important; }
          .nav-dropdown { display: none !important; }
          .nav-apply { display: none !important; }
          .nav-hamburger { display: flex !important; align-items: center; justify-content: center; }
          #nav-toggle:checked ~ .mobile-overlay { display: flex !important; }
          .back-to-top {
            right: auto !important;
            left: 50% !important;
            bottom: 24px !important;
            transform: translate(-50%, var(--back-top-y)) !important;
          }
        }
      `}</style>
    </>
  );
}
