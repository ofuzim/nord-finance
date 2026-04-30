'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import {
  calculateCreditScore,
  calculateCreditScoreCompletion,
  creditScoreFieldKeys,
  creditScoreSelectOptions,
  creditScoreSections,
  getApplicationUrl,
  getCreditScoreBreakdown,
  getCreditScoreSignals,
  getCreditScoreTier,
  type CreditScoreBreakdown,
  type CreditScoreSignal,
  type CreditScoreTier,
} from "@/lib/creditScoreModel";

const DEBUG_BYPASS_SCORE_COMPLETION =
  process.env.NEXT_PUBLIC_BYPASS_COMPLETION === "true";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: 10,
      }}
    >
      {children}
    </label>
  );
}

function fieldStyle(): React.CSSProperties {
  return {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "15px 18px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: 14,
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  };
}

function SectionHeader({ title, weight }: { title: string; weight: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
      }}
    >
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#C39529",
          whiteSpace: "nowrap",
        }}
      >
        {title} <span style={{ color: "rgba(255,255,255,0.3)" }}>({weight})</span>
      </span>
      <span style={{ height: 1, flex: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

function ScoreGauge({
  score,
  hasPreview,
  resultRevealed,
}: {
  score: number;
  hasPreview: boolean;
  resultRevealed: boolean;
}) {
  const tier = getCreditScoreTier(score);
  const progress = Math.max(0, Math.min(1, (score - 500) / 400));
  const circumference = 314;
  const dash = hasPreview ? circumference * progress : 0;

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.035)",
        borderRadius: 16,
        padding: "42px 38px",
        position: "relative",
        overflow: "hidden",
      }}
      className="score-card"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 10%, rgba(195,149,41,0.1), transparent 42%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <svg width="280" height="180" viewBox="0 0 280 180" aria-hidden="true">
            <path
              d="M40 142a100 100 0 0 1 200 0"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="18"
              strokeLinecap="round"
              pathLength={circumference}
            />
            <path
              d="M40 142a100 100 0 0 1 200 0"
              fill="none"
              stroke={tier.color}
              strokeWidth="18"
              strokeLinecap="round"
              pathLength={circumference}
              strokeDasharray={`${dash} ${circumference}`}
              style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.3s ease" }}
            />
            <text
              x="140"
              y="118"
              textAnchor="middle"
              fill="white"
              fontFamily="'Poppins', sans-serif"
              fontWeight="700"
              fontSize={hasPreview ? "46" : "34"}
            >
              {hasPreview ? score : "--"}
            </text>
            <text
              x="140"
              y="145"
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontFamily="'Poppins', sans-serif"
              fontWeight="500"
              fontSize="10"
              letterSpacing="0.22em"
            >
              NORD SCORE
            </text>
          </svg>
        </div>

        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: resultRevealed ? tier.color : "rgba(255,255,255,0.72)",
              marginBottom: 8,
            }}
          >
            {resultRevealed ? tier.name : hasPreview ? "Live score preview" : "Complete fields to score"}
          </p>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              lineHeight: 1.8,
              color: "var(--text-muted)",
              marginBottom: resultRevealed ? 20 : 0,
            }}
          >
            {resultRevealed
              ? `${tier.rate} - ${tier.note}`
              : hasPreview
                ? "Keep filling the form, then calculate to reveal your tier and offer."
                : "Your score and eligible financing tier will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "gold" }) {
  return (
    <div
      style={{
        backgroundColor: tone === "gold" ? "rgba(195,149,41,0.09)" : "rgba(255,255,255,0.045)",
        border: tone === "gold" ? "1px solid rgba(195,149,41,0.25)" : "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "28px 30px",
      }}
    >
      {children}
    </div>
  );
}

function ResultEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        marginBottom: 20,
        fontWeight: 500,
      }}
    >
      // {children}
    </p>
  );
}

function ResultsPanel({
  score,
  tier,
  breakdown,
  signals,
  firstName,
  applicationUrl,
  onEdit,
  onContinue,
}: {
  score: number;
  tier: CreditScoreTier;
  breakdown: CreditScoreBreakdown[];
  signals: CreditScoreSignal[];
  firstName: string;
  applicationUrl: string;
  onEdit: () => void;
  onContinue: () => void;
}) {
  const name = firstName || "You";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Hero — the verdict */}
      <ResultCard>
        <p style={{ color: "#C39529", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 18 }}>
          Your Result
        </p>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(22px, 2.4vw, 32px)", color: "white", lineHeight: 1.4, marginBottom: 10 }}>
          {name === "You" ? "You scored" : `${name}, you scored`}{" "}
          <span style={{ fontWeight: 700, color: tier.color }}>{score} / 1000</span>{" "}
          and qualify for <span style={{ fontWeight: 700 }}>Nord vehicle financing.</span>
        </p>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24 }}>
          Your profile places you in our <span style={{ color: tier.color, fontWeight: 600 }}>{tier.name}</span>. {tier.note}.
        </p>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginBottom: 20 }} />

        {/* What this means in plain terms */}
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>What this means for you</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="score-offer-grid">
          {[
            { label: "Interest Rate", value: tier.rate, desc: "per annum" },
            { label: "Repayment Period", value: tier.maxTenure, desc: "maximum" },
            { label: "Down Payment", value: tier.minDownPayment, desc: "minimum required" },
          ].map((item, i) => (
            <div key={item.label} style={{ padding: "0", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none", paddingLeft: i > 0 ? 20 : 0 }} className="score-offer-item">
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 6 }}>{item.label}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(16px, 1.8vw, 22px)", color: "white", lineHeight: 1, marginBottom: 4 }}>{item.value}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Signals — things to note */}
      <ResultCard>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 18 }}>Before you apply</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {signals.map((signal) => (
            <div key={signal.text} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                backgroundColor: signal.tone === "red" ? "#ef4444" : signal.tone === "yellow" ? "#C39529" : "#22c55e",
              }} />
              <span style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7 }}>{signal.text}</span>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* CTA */}
      <ResultCard tone="gold">
        <p className="score-cta-heading" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300, fontSize: "clamp(20px, 2.2vw, 28px)", color: "white", lineHeight: 1.4, marginBottom: 10 }}>
          Ready to move forward?
        </p>
        <p className="score-cta-body" style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
          Your score is based on the information you've provided. When you apply, we verify your identity and documents to confirm your final rate and repayment terms.
        </p>
        <div className="score-cta-buttons" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onEdit}
            style={{
              flex: 1, whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.14)",
              background: "transparent", color: "var(--text-muted)", borderRadius: 100,
              padding: "14px 20px", fontFamily: "'Poppins', sans-serif", fontSize: 11,
              fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer",
            }}
          >
            Recalculate My Score
          </button>
          <button
            onClick={onContinue}
            style={{
              flex: 1, textAlign: "center", border: "none",
              backgroundColor: "#C39529", color: "#000", borderRadius: 100,
              padding: "14px 20px", fontFamily: "'Poppins', sans-serif", fontSize: 11,
              fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer",
            }}
          >
            Start My Loan Application →
          </button>
        </div>
      </ResultCard>
    </div>
  );
}

const SESSION_KEY = "nord_credit_score_state";

export function CreditScoreCalculatorPage() {
  const [values, setValues] = useState<Record<string, number>>({});
  const [identity, setIdentity] = useState({ firstName: "", lastName: "", email: "" });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [obligations, setObligations] = useState(0);
  const [downPayment, setDownPayment] = useState(30);
  const [incomeDisplay, setIncomeDisplay] = useState('--');
  const [obligationsDisplay, setObligationsDisplay] = useState('--');
  const [downPayDisplay, setDownPayDisplay] = useState('30%');
  const [resultRevealed, setResultRevealed] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Restore state from sessionStorage when landing on ?result=1
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("result") !== "1") return;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (!saved) return;
      const s = JSON.parse(saved);
      if (s.values)       setValues(s.values);
      if (s.identity)     setIdentity(s.identity);
      if (s.monthlyIncome !== undefined) setMonthlyIncome(s.monthlyIncome);
      if (s.obligations   !== undefined) setObligations(s.obligations);
      if (s.downPayment   !== undefined) setDownPayment(s.downPayment);
      setResultRevealed(true);
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const sidebarRef = useRef<HTMLElement>(null);
  const resultStackRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const calculationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incomeInputRef = useRef<HTMLInputElement>(null);
  const obligationsInputRef = useRef<HTMLInputElement>(null);
  const downPayInputRef = useRef<HTMLInputElement>(null);
  const [touchedSliders, setTouchedSliders] = useState({
    monthlyIncome: false,
    obligations: false,
  });

  // Mobile: el.oninput fires on iOS Safari where React delegation misses range input events.
  // flushSync forces an immediate synchronous re-render so the display updates during drag.
  useEffect(() => {
    const incomeEl = incomeInputRef.current;
    if (incomeEl) {
      incomeEl.oninput = () => {
        const v = Number(incomeEl.value);
        flushSync(() => {
          setIncomeDisplay(`₦${v.toLocaleString('en-NG')}`);
          setMonthlyIncome(v);
          setTouchedSliders(cur => ({ ...cur, monthlyIncome: true }));
          setResultRevealed(false);
          setIsCalculating(false);
        });
        if (calculationTimerRef.current) { clearTimeout(calculationTimerRef.current); calculationTimerRef.current = null; }
      };
    }
    const obligationsEl = obligationsInputRef.current;
    if (obligationsEl) {
      obligationsEl.oninput = () => {
        const v = Number(obligationsEl.value);
        flushSync(() => {
          setObligationsDisplay(`₦${v.toLocaleString('en-NG')}`);
          setObligations(v);
          setTouchedSliders(cur => ({ ...cur, obligations: true }));
          setResultRevealed(false);
          setIsCalculating(false);
        });
        if (calculationTimerRef.current) { clearTimeout(calculationTimerRef.current); calculationTimerRef.current = null; }
      };
    }
    const downPayEl = downPayInputRef.current;
    if (downPayEl) {
      downPayEl.oninput = () => {
        const v = Number(downPayEl.value);
        flushSync(() => {
          setDownPayDisplay(`${v}%`);
          setDownPayment(v);
          setResultRevealed(false);
          setIsCalculating(false);
        });
        if (calculationTimerRef.current) { clearTimeout(calculationTimerRef.current); calculationTimerRef.current = null; }
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const completedSelects = creditScoreFieldKeys.filter((key) => values[key] !== undefined).length;
  const identityComplete = Boolean(identity.firstName.trim() && identity.lastName.trim() && identity.email.trim());

  const score = useMemo(
    () => calculateCreditScore({ values, monthlyIncome, obligations, downPayment }),
    [downPayment, monthlyIncome, obligations, values]
  );

  const completion = calculateCreditScoreCompletion({ completedSelects, identityComplete });
  const canCalculate = DEBUG_BYPASS_SCORE_COMPLETION || completion >= 70;
  const showResult = canCalculate && resultRevealed;
  const tier = getCreditScoreTier(score);
  const breakdown = useMemo(() => getCreditScoreBreakdown(values), [values]);
  const signals = useMemo(
    () => getCreditScoreSignals({ score, values, monthlyIncome, obligations, downPayment }),
    [downPayment, monthlyIncome, obligations, score, values]
  );
  const applicationUrl = getApplicationUrl({
    score,
    tier: tier.name,
    firstName: identity.firstName.trim(),
    lastName: identity.lastName.trim(),
    email: identity.email.trim(),
    employmentType: values.employmentType !== undefined
      ? creditScoreSelectOptions.employmentType.find((option) => option.value === values.employmentType)?.label
      : undefined,
    monthlyIncome,
    downPayment,
  });
  const hasPreview =
    completedSelects > 0 ||
    touchedSliders.monthlyIncome ||
    touchedSliders.obligations ||
    Boolean(identity.firstName.trim() || identity.lastName.trim() || identity.email.trim());

  const hideStaleResult = () => {
    if (resultRevealed) setResultRevealed(false);
    if (isCalculating) setIsCalculating(false);
    if (calculationTimerRef.current) {
      clearTimeout(calculationTimerRef.current);
      calculationTimerRef.current = null;
    }
  };

  const scrollToResultStack = useCallback(() => {
    const target = resultStackRef.current ?? formSectionRef.current;
    if (!target) return;

    const headerOffset = window.matchMedia("(max-width: 700px)").matches ? 84 : 128;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const revealResult = () => {
    if (!canCalculate || isCalculating) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ values, identity, monthlyIncome, obligations, downPayment }));
    } catch {}
    setIsCalculating(true);
    calculationTimerRef.current = setTimeout(() => {
      setResultRevealed(true);
      setIsCalculating(false);
      calculationTimerRef.current = null;
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (calculationTimerRef.current) clearTimeout(calculationTimerRef.current);
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const resetNavigationState = () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }
      setIsNavigating(false);
    };

    window.addEventListener("pagehide", resetNavigationState);
    window.addEventListener("pageshow", resetNavigationState);
    return () => {
      window.removeEventListener("pagehide", resetNavigationState);
      window.removeEventListener("pageshow", resetNavigationState);
    };
  }, []);

  useEffect(() => {
    if (!showResult) return;

    requestAnimationFrame(() => {
      scrollToResultStack();
    });
  }, [scrollToResultStack, showResult]);

  useEffect(() => {
    if (!resultRevealed) return;
    const params = new URLSearchParams(window.location.search);
    params.set("result", "1");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [resultRevealed]);

  const editDetails = () => {
    setResultRevealed(false);
    const params = new URLSearchParams(window.location.search);
    params.delete("result");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    requestAnimationFrame(() => {
      scrollToResultStack();
    });
  };

  return (
    <main style={{ paddingTop: 72, backgroundColor: "#000" }}>
      {isCalculating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            backgroundColor: "rgba(0,0,0,0.76)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "min(420px, 100%)",
              border: "1px solid rgba(255,255,255,0.14)",
              backgroundColor: "rgba(10,10,10,0.92)",
              borderRadius: 18,
              padding: "34px 32px",
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.12)",
                borderTopColor: "rgba(255,255,255,0.9)",
                margin: "0 auto 22px",
              }}
              className="score-loader"
            />
            <p
              style={{
                color: "#C39529",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Calculating Score
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.8 }}>
              Matching your financial profile to the right Nord financing tier.
            </p>
          </div>
        </div>
      )}
      {isNavigating && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            backgroundColor: "rgba(0,0,0,0.76)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "min(420px, 100%)",
              border: "1px solid rgba(255,255,255,0.14)",
              backgroundColor: "rgba(10,10,10,0.92)",
              borderRadius: 18,
              padding: "34px 32px",
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.12)",
                borderTopColor: "rgba(255,255,255,0.9)",
                margin: "0 auto 22px",
              }}
              className="score-loader"
            />
            <p
              style={{
                color: "#C39529",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Preparing Application
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.8 }}>
              Taking you to the full application form.
            </p>
          </div>
        </div>
      )}
      <section
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at 16% 18%, rgba(195,149,41,0.13), transparent 28%), linear-gradient(180deg, #111 0%, #050505 100%)",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "96px 80px 72px",
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 72,
            alignItems: "end",
          }}
          className="score-hero"
        >
          <div>
            <div className="score-hero-eyebrow" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <span style={{ color: "#C39529", fontWeight: 700, fontSize: 12 }}>//</span>
              <span style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#C39529", fontWeight: 500 }}>
                Nord Credit Score
              </span>
            </div>
            <h1
              className="score-hero-title"
              style={{
                fontFamily: "'Morpha', Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(44px, 5vw, 78px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: "white",
                maxWidth: 720,
              }}
            >
              Check your score. <br />
              <em style={{ fontStyle: "normal", fontWeight: "bold" }}>Know your tier.</em>
            </h1>
          </div>
          <p
            className="score-hero-copy"
            style={{
              fontSize: 15,
              lineHeight: 1.9,
              color: "rgba(255,255,255,0.48)",
              maxWidth: 410,
              marginLeft: "auto",
            }}
          >
            Start with your Nord Credit Score to see your likely tier, rate, tenure, and down-payment range. Once your result is ready, you can continue to the full application with your score carried forward.
          </p>
        </div>
      </section>

      <section ref={formSectionRef}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "72px 80px 120px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 440px",
            gap: 64,
            alignItems: "start",
          }}
          className="score-layout"
        >
          <div ref={resultStackRef} style={{ scrollMarginTop: 96 }}>
            {showResult ? (
              <ResultsPanel
                score={score}
                tier={tier}
                breakdown={breakdown}
                signals={signals}
                firstName={identity.firstName.trim()}
                applicationUrl={applicationUrl}
                onEdit={editDetails}
                onContinue={() => {
                  setIsNavigating(true);
                  if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
                  navigationTimerRef.current = setTimeout(() => {
                    navigationTimerRef.current = null;
                    window.location.assign(applicationUrl);
                  }, 1600);
                }}
              />
            ) : (
              <>
            <SectionHeader title="Your Identity" weight="Required" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }} className="score-field-grid">
              <div>
                <FieldLabel>First Name *</FieldLabel>
                <input
                  value={identity.firstName}
                  onChange={(e) => {
                    hideStaleResult();
                    setIdentity({ ...identity, firstName: e.target.value });
                  }}
                  placeholder="First name"
                  style={fieldStyle()}
                />
              </div>
              <div>
                <FieldLabel>Last Name *</FieldLabel>
                <input
                  value={identity.lastName}
                  onChange={(e) => {
                    hideStaleResult();
                    setIdentity({ ...identity, lastName: e.target.value });
                  }}
                  placeholder="Last name"
                  style={fieldStyle()}
                />
              </div>
            </div>
            <div style={{ marginBottom: 54 }}>
              <FieldLabel>Email Address *</FieldLabel>
              <input
                value={identity.email}
                onChange={(e) => {
                  hideStaleResult();
                  setIdentity({ ...identity, email: e.target.value });
                }}
                placeholder="your@email.com"
                type="email"
                style={fieldStyle()}
              />
            </div>

            {creditScoreSections.map((section) => (
              <div key={section.title} style={{ marginBottom: 54 }}>
                <SectionHeader title={section.title} weight={section.weight} />

                {section.title === "Income Stability" && (
                  <div style={{ marginBottom: 24 }}>
                    <FieldLabel>Monthly Net Income (₦)</FieldLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 18 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.34)" }}>₦0</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#C39529", fontSize: 24 }}>{incomeDisplay}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.34)", textAlign: "right" }}>₦10M+</span>
                    </div>
                    <input
                      ref={incomeInputRef}
                      type="range"
                      min={0}
                      max={10000000}
                      step={250000}
                      defaultValue={0}
                      className="score-range"
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setIncomeDisplay(`₦${v.toLocaleString('en-NG')}`);
                        setMonthlyIncome(v);
                        setTouchedSliders(cur => ({ ...cur, monthlyIncome: true }));
                        setResultRevealed(false);
                        setIsCalculating(false);
                        if (calculationTimerRef.current) { clearTimeout(calculationTimerRef.current); calculationTimerRef.current = null; }
                      }}
                    />
                  </div>
                )}

                {section.title === "Debt-to-Income Ratio" && (
                  <div style={{ marginBottom: 24 }}>
                    <FieldLabel>Existing Monthly Obligations (₦)</FieldLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 18 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.34)" }}>₦0</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#C39529", fontSize: 24 }}>{obligationsDisplay}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.34)", textAlign: "right" }}>₦5M+</span>
                    </div>
                    <input
                      ref={obligationsInputRef}
                      type="range"
                      min={0}
                      max={5000000}
                      step={100000}
                      defaultValue={0}
                      className="score-range"
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setObligationsDisplay(`₦${v.toLocaleString('en-NG')}`);
                        setObligations(v);
                        setTouchedSliders(cur => ({ ...cur, obligations: true }));
                        setResultRevealed(false);
                        setIsCalculating(false);
                        if (calculationTimerRef.current) { clearTimeout(calculationTimerRef.current); calculationTimerRef.current = null; }
                      }}
                    />
                  </div>
                )}

                {section.title === "Down Payment Strength" && (
                  <div style={{ marginBottom: 24 }}>
                    <FieldLabel>Down Payment Percentage</FieldLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 18 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.34)" }}>0%</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#C39529", fontSize: 24 }}>{downPayDisplay}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.34)", textAlign: "right" }}>70%+</span>
                    </div>
                    <input
                      ref={downPayInputRef}
                      type="range"
                      min={0}
                      max={70}
                      step={5}
                      defaultValue={30}
                      className="score-range"
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setDownPayDisplay(`${v}%`);
                        setDownPayment(v);
                        setResultRevealed(false);
                        setIsCalculating(false);
                        if (calculationTimerRef.current) { clearTimeout(calculationTimerRef.current); calculationTimerRef.current = null; }
                      }}
                    />
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px" }} className="score-field-grid">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <FieldLabel>{field.label}</FieldLabel>
                      <select
                        value={values[field.key] ?? ""}
                        onChange={(e) => {
                          hideStaleResult();
                          setValues({
                            ...values,
                            [field.key]: Number(e.target.value),
                          });
                        }}
                        style={{
                          ...fieldStyle(),
                          cursor: "pointer",
                          appearance: "none",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C39529' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 18px center",
                        }}
                      >
                        <option value="">- Select -</option>
                        {field.options.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={revealResult}
              onTouchEnd={(e) => { e.preventDefault(); revealResult(); }}
              style={{
                width: "100%",
                border: "none",
                backgroundColor: canCalculate ? "#C39529" : "rgba(195,149,41,0.42)",
                color: "#000",
                borderRadius: 100,
                padding: "18px 28px",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: canCalculate && !isCalculating ? "pointer" : "not-allowed",
                marginTop: 10,
                opacity: isCalculating ? 0.72 : 1,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "rgba(195,149,41,0.15)",
              }}
            >
              {isCalculating
                ? "Calculating..."
                : canCalculate
                  ? "Calculate My Score"
                  : `Complete Form (${completion}% / 70%)`}
            </button>
              </>
            )}
          </div>

          <aside
            ref={sidebarRef}
            className="score-sidebar"
            style={{
              position: "sticky",
              top: 104,
              scrollMarginTop: 96,
            }}
          >
            <ScoreGauge score={score} hasPreview={hasPreview} resultRevealed={showResult} />
            {showResult ? (
              <div
                style={{
                  marginTop: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "24px 22px",
                }}
              >
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 18 }}>How your score was calculated</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {breakdown.map((item) => (
                    <div key={item.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                          {item.name} <span style={{ color: "rgba(255,255,255,0.22)" }}>({Math.round(item.weight * 100)}%)</span>
                        </span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", color: tier.color, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>+{item.points}</span>
                      </div>
                      <div style={{ height: 2, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: `${item.score}%`, height: "100%", backgroundColor: tier.color, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  lineHeight: 1.7,
                }}
              >
                Completion: <span style={{ color: "#C39529", fontWeight: 700 }}>{completion}%</span>. This calculator gives you an estimate based on your inputs. Final approval is subject to document verification.
              </div>
            )}
          </aside>
        </div>
      </section>

      <style>{`
        .score-range {
          width: 100%;
          accent-color: #C39529;
          margin-top: 12px;
          height: 34px;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .score-range::-webkit-slider-runnable-track {
          height: 5px;
          background: rgba(255,255,255,0.16);
          border-radius: 99px;
        }
        .score-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #C39529;
          border: 3px solid #050505;
          box-shadow: 0 0 0 1px rgba(195,149,41,0.48), 0 8px 20px rgba(0,0,0,0.35);
          margin-top: -9.5px;
        }
        .score-range::-moz-range-track {
          height: 5px;
          background: rgba(255,255,255,0.16);
          border-radius: 99px;
        }
        .score-range::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #C39529;
          border: 3px solid #050505;
          box-shadow: 0 0 0 1px rgba(195,149,41,0.48), 0 8px 20px rgba(0,0,0,0.35);
        }
        .score-loader {
          animation: scoreSpin 0.9s linear infinite;
        }
        @keyframes scoreSpin {
          to { transform: rotate(360deg); }
        }
        .score-layout input:-webkit-autofill,
        .score-layout input:-webkit-autofill:hover,
        .score-layout input:-webkit-autofill:focus,
        .score-layout select:-webkit-autofill,
        .score-layout select:-webkit-autofill:hover,
        .score-layout select:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
          box-shadow: 0 0 0 1000px #151515 inset !important;
          -webkit-box-shadow: 0 0 0 1000px #151515 inset !important;
          border-color: rgba(195,149,41,0.35) !important;
          transition: background-color 9999s ease-out 0s;
        }
        @media (max-width: 1100px) {
          .score-hero,
          .score-layout {
            grid-template-columns: 1fr !important;
            padding-left: 40px !important;
            padding-right: 40px !important;
          }
          .score-sidebar {
            position: relative !important;
            top: 0 !important;
          }
        }
        @media (max-width: 700px) {
          input, select, textarea { font-size: 1rem !important; }
          .score-sidebar { display: none !important; }
          .score-hero,
          .score-layout {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          .score-hero {
            padding-top: 52px !important;
            padding-bottom: 42px !important;
            gap: 18px !important;
          }
          .score-hero-eyebrow {
            gap: 10px !important;
            margin-bottom: 16px !important;
          }
          .score-hero-eyebrow span:first-child {
            font-size: 10px !important;
          }
          .score-hero-eyebrow span:last-child {
            font-size: 9px !important;
            letter-spacing: 0.2em !important;
          }
          .score-hero-title {
            font-size: 38px !important;
            line-height: 1.05 !important;
            margin: 0 !important;
          }
          .score-hero-copy {
            font-size: 15px !important;
            line-height: 1.85 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .score-field-grid {
            grid-template-columns: 1fr !important;
          }
          .score-flow-grid {
            grid-template-columns: 1fr !important;
          }
          .score-offer-grid {
            grid-template-columns: 1fr !important;
          }
          .score-next-grid {
            grid-template-columns: 1fr !important;
          }
          .score-offer-item {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
          .score-offer-item:first-child {
            border-top: none !important;
            padding-top: 0 !important;
          }
          .score-offer-item:last-child {
            padding-bottom: 0 !important;
          }
          .score-card {
            padding: 30px 22px !important;
          }
          .score-cta-heading, .score-cta-body {
            text-align: center !important;
          }
          .score-cta-buttons {
            flex-direction: column-reverse !important;
          }
          .score-cta-buttons button {
            flex: none !important;
            width: 100% !important;
            text-align: center !important;
          }
        }
      `}</style>
    </main>
  );
}
