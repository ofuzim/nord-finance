'use client'

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import tavetOutline from "@/imports/tavet-outline.svg";
import sedanOutline from "@/imports/sedan-outline.svg";
import suvOutline from "@/imports/suv-outline.svg";
import pickupOutline from "@/imports/pick-up-outline.svg";
import busOutline from "@/imports/bus-outline.svg";
import { vehicleGroups } from "@/lib/vehicleCatalog";

type FormValues = Record<string, string>;
type UploadValues = Record<string, string>;

const BYPASS_COMPLETION = process.env.NEXT_PUBLIC_BYPASS_COMPLETION === "true";

function stepIsComplete(step: number, values: FormValues, consent: boolean): boolean {
  if (BYPASS_COMPLETION) return true;
  const v = (k: string) => !!values[k]?.trim();
  if (step === 1) return [
    "title", "firstName", "lastName", "gender", "dateOfBirth", "maritalStatus",
    "stateOfOrigin", "lgaOfOrigin", "phoneNumber", "emailAddress", "homeAddress",
    "stateOfResidence", "lgaOfResidence", "residentialStatus", "occupation", "employmentType",
  ].every(v);
  if (step === 2) return ["idType", "idNumber", "nin", "bvn"].every(v);
  if (step === 3) return v("vehicleModel");
  if (step === 4) return consent;
  return true;
}

const steps = [
  "Personal Information",
  "Identity Verification",
  "Vehicle of Interest",
  "Consent & Submit",
];

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const categoryDescriptions: Record<string, string> = {
  "Sedans": "Classic 4-door passenger cars — comfortable, fuel-efficient, ideal for daily commuting.",
  "SUVs": "Sport Utility Vehicles — spacious, high-riding, suited for families and varied terrain.",
  "Pickup Trucks": "Rugged trucks with an open cargo bed — built for work and off-road capability.",
  "Buses": "Commercial passenger buses — designed for group transport and fleet operations.",
  "Tavet Models": "Tavet by Nord — a lineup of fully electric vehicles from a sister brand, built for performance and efficiency.",
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Sedans": (
    <svg width="52" height="26" viewBox="0 0 52 26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 L6 16 L14 11 L24 9 L32 9 L42 12 L50 17 L50 22 Z" />
    </svg>
  ),
  "SUVs": (
    <svg width="52" height="26" viewBox="0 0 52 26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 L2 8 L46 8 L50 10 L50 22 Z" />
    </svg>
  ),
  "Pickup Trucks": (
    <svg width="52" height="26" viewBox="0 0 52 26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 L2 10 L22 10 L22 7 L42 7 L50 12 L50 22 Z" />
      <line x1="22" y1="10" x2="22" y2="22" />
    </svg>
  ),
  "Buses": (
    <svg width="52" height="26" viewBox="0 0 52 26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="48" height="17" rx="2" />
      <rect x="6" y="9" width="5" height="6" rx="1" />
      <rect x="15" y="9" width="5" height="6" rx="1" />
      <rect x="24" y="9" width="5" height="6" rx="1" />
      <rect x="33" y="9" width="5" height="6" rx="1" />
    </svg>
  ),
  "Tavet Models": (
    <svg width="52" height="26" viewBox="0 0 52 26" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 L4 18 L12 11 L26 8 L40 10 L48 16 L50 22 Z" />
    </svg>
  ),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#C39529",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <span style={{ height: 1, flex: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        marginBottom: 9,
      }}
    >
      {children} {required && <span style={{ color: "#C39529" }}>*</span>}
    </label>
  );
}

function fieldStyle(): React.CSSProperties {
  return {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "14px 16px",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    colorScheme: "dark",
  };
}

function TextField({
  label,
  name,
  values,
  setValues,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  values: FormValues;
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        value={values[name] ?? ""}
        placeholder={placeholder}
        onChange={(e) => setValues((current) => ({ ...current, [name]: e.target.value }))}
        style={fieldStyle()}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  values,
  setValues,
  options,
  required,
  placeholder = "-- Select --",
}: {
  label: string;
  name: string;
  values: FormValues;
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <select
        value={values[name] ?? ""}
        onChange={(e) => setValues((current) => ({ ...current, [name]: e.target.value }))}
        style={{
          ...fieldStyle(),
          appearance: "none",
          cursor: "pointer",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C39529' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroup({
  label,
  name,
  values,
  setValues,
  options,
  required,
}: {
  label: string;
  name: string;
  values: FormValues;
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 6 }}>
        {options.map((option) => {
          const selected = values[name] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setValues((current) => ({ ...current, [name]: option }))}
              style={{
                border: selected ? "1px solid #C39529" : "1px solid rgba(255,255,255,0.1)",
                backgroundColor: selected ? "rgba(195,149,41,0.12)" : "rgba(255,255,255,0.045)",
                color: selected ? "#C39529" : "rgba(255,255,255,0.62)",
                borderRadius: 100,
                padding: "10px 14px",
                fontSize: 12,
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UploadBox({
  title,
  subtitle,
  name,
  uploads,
  setUploads,
}: {
  title: string;
  subtitle: string;
  name: string;
  uploads: UploadValues;
  setUploads: React.Dispatch<React.SetStateAction<UploadValues>>;
}) {
  const fileName = uploads[name];

  return (
    <label
      style={{
        display: "block",
        border: fileName ? "1px dashed rgba(34,197,94,0.55)" : "1px dashed rgba(255,255,255,0.14)",
        backgroundColor: fileName ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.045)",
        borderRadius: 14,
        padding: 24,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploads((current) => ({ ...current, [name]: file.name }));
        }}
      />
      <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
        {fileName ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        )}
      </div>
      <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title}</p>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.6 }}>{subtitle}</p>
      {fileName && <p style={{ color: "#22c55e", fontSize: 12, marginTop: 10 }}>{fileName}</p>}
    </label>
  );
}

function StepNav({
  currentStep,
  setStep,
  submit,
  canProceed,
  onBack,
  onCancel,
}: {
  currentStep: number;
  setStep: (step: number) => void;
  submit?: () => void;
  canProceed: boolean;
  onBack: () => void;
  onCancel: () => void;
}) {
  const disabled = !canProceed;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginTop: 44 }} className="application-actions">
      <button
        type="button"
        onClick={currentStep === 1 ? onCancel : onBack}
        style={{
          border: "1px solid rgba(255,255,255,0.18)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          borderRadius: 100,
          padding: "14px 30px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {currentStep === 1 ? "Cancel" : "Back"}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (currentStep === 4 ? submit?.() : setStep(currentStep + 1))}
        style={{
          border: currentStep === 4 ? "none" : "1px solid #C39529",
          backgroundColor: currentStep === 4 ? "#C39529" : "transparent",
          color: currentStep === 4 ? "#000" : "#C39529",
          borderRadius: 100,
          padding: "14px 36px",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.35 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {currentStep === 4 ? "Submit Application" : "Continue"}
      </button>
    </div>
  );
}

export function ApplicationFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carriedScore = searchParams.get("score");
  const carriedTier = searchParams.get("tier");
  const carriedFirstName = searchParams.get("firstName") ?? "";
  const carriedLastName = searchParams.get("lastName") ?? "";
  const carriedEmail = searchParams.get("email") ?? "";
  const carriedEmploymentType = searchParams.get("employmentType") ?? "";
  const carriedMonthlyIncome = searchParams.get("monthlyIncome") ?? "";
  const carriedDownPayment = searchParams.get("downPayment") ?? "";

  const formRef = React.useRef<HTMLDivElement>(null);

  const stepParam = searchParams.get("step");
  const initialSuccess = stepParam === "success";
  const initialStep = initialSuccess ? steps.length : Math.min(Math.max(parseInt(stepParam ?? "1", 10) || 1, 1), steps.length);
  const [currentStep, setCurrentStepState] = useState(initialStep);
  const [success, setSuccess] = useState(initialSuccess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadValues>({});
  const [values, setValues] = useState<FormValues>({
    firstName: carriedFirstName,
    lastName: carriedLastName,
    emailAddress: carriedEmail,
    employmentType: carriedEmploymentType.includes("Self-Employed")
      ? "Self Employed"
      : carriedEmploymentType.startsWith("Salaried")
        ? "Full Time"
        : "",
    monthlyIncome: carriedMonthlyIncome,
    downPayment: carriedDownPayment,
  });

  const progress = success ? 100 : (currentStep / steps.length) * 100;

  const scrollToFormSection = () => {
    if (formRef.current) {
      const top = formRef.current.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const setStep = (step: number) => {
    setSuccess(false);
    setCurrentStepState(step);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(step));
    router.push(`?${params.toString()}`, { scroll: false });
    scrollToFormSection();
  };

  const selectedVehicle = values.vehicleModel;

  const summary = useMemo(
    () => [
      ["Applicant", `${values.firstName ?? ""} ${values.lastName ?? ""}`.trim() || "--"],
      ["Email", values.emailAddress || "--"],
      ["Phone", values.phoneNumber || "--"],
      ["Employment", values.employmentType || "--"],
      ["Residential Status", values.residentialStatus || "--"],
      ["Vehicle of Interest", selectedVehicle || "--"],
      ["Score / Tier", carriedScore && carriedTier ? `${carriedScore} - ${carriedTier}` : "--"],
      ["Monthly Income", values.monthlyIncome ? `N${Number(values.monthlyIncome).toLocaleString("en-NG")}` : "--"],
      ["Down Payment", values.downPayment ? `${values.downPayment}%` : "--"],
      ["BVN Provided", values.bvn ? "Yes" : "No"],
      ["NIN Provided", values.nin ? "Yes" : "No"],
    ],
    [carriedScore, carriedTier, selectedVehicle, values]
  );

  const submitApplication = () => {
    if (isSubmitting) return;
    if (!consent && !BYPASS_COMPLETION) {
      return;
    }

    const submission = {
      ...values,
      uploads,
      creditScore: carriedScore,
      creditTier: carriedTier,
      submittedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(window.localStorage.getItem("nordKycSubmissions") || "[]");
    existing.push(submission);
    window.localStorage.setItem("nordKycSubmissions", JSON.stringify(existing));
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", "success");
      router.push(`?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  };

  return (
    <main style={{ paddingTop: 72, backgroundColor: "#000", minHeight: success ? "auto" : "100vh" }}>
      {isSubmitting && (
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
              className="application-loader"
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
              Submitting Application
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.8 }}>
              Securing your details and preparing your confirmation.
            </p>
          </div>
        </div>
      )}
      {!success && (
        <div style={{ height: 2, backgroundColor: "rgba(255,255,255,0.08)", position: "sticky", top: 72, zIndex: 99 }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #C39529, #EDD98A)",
              transition: "width 0.35s ease",
            }}
          />
        </div>
      )}

      {!success && (
        <section
          style={{
            background:
              "radial-gradient(circle at 16% 20%, rgba(195,149,41,0.14), transparent 30%), linear-gradient(180deg, #111 0%, #050505 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "84px 80px 64px",
            }}
            className="application-shell"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40 }} className="application-header-row">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }} className="application-hero-eyebrow">
                  <span style={{ color: "#C39529", fontWeight: 700, fontSize: 12 }}>//</span>
                  <span style={{ color: "#C39529", fontSize: 10, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase" }}>
                    KYC Application
                  </span>
                  <span className="application-hero-eyebrow-end" style={{ color: "#C39529", fontWeight: 700, fontSize: 12, display: "none" }}>//</span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Morpha', Georgia, serif", fontWeight: 400,
                    fontSize: "clamp(40px, 5vw, 68px)",
                    lineHeight: 1.04,
                    color: "white",
                    letterSpacing: "-0.03em",
                    maxWidth: 620,
                  }}
                >
                  Know Your Customer <br />
                  <em style={{ fontStyle: "normal", fontWeight: "bold" }}>Application Form</em>
                </h1>
                <p className="application-hero-copy" style={{ color: "rgba(255,255,255,0.48)", fontSize: 15, lineHeight: 1.9, maxWidth: 620, marginTop: 22 }}>
                  Complete all four sections to submit your application. Your information is securely processed by Nord Finance and used for credit assessment.
                </p>
              </div>
              <div style={{ minWidth: 260 }}>
                {(carriedScore || carriedTier) && (
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 14,
                      padding: "20px 22px",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ position: "relative", marginBottom: 14 }}>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.6 }}>
                        Your Nord<br />Credit Score
                      </span>
                      <span className="score-info-icon" aria-label="Your credit score was calculated from your pre-qualification assessment" style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }}>
                        <span className="score-tooltip">Calculated from your pre-qualification assessment and carried into this application.</span>
                        i
                      </span>
                    </div>
                    <p style={{ color: "#C39529", fontWeight: 800, fontSize: 48, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8 }}>
                      {carriedScore ?? "--"}
                    </p>
                    {carriedTier && (
                      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                        {carriedTier}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section ref={formRef}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: success ? "0 80px" : "64px 80px 120px",
          }}
          className="application-shell"
        >
          {success ? (
            <div style={{ minHeight: 720, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 0 72px" }}>
              <div style={{ fontSize: 58, marginBottom: 22 }}>OK</div>
              <h2 style={{ fontFamily: "'Morpha', Georgia, serif", fontSize: 52, lineHeight: 1.05, marginBottom: 18 }}>
                Application <em style={{ fontStyle: "normal", fontWeight: "bold" }}>Submitted</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.9, maxWidth: 560, margin: "0 auto 34px" }}>
                Thank you for your application. Our team will review your information and contact you within 24-48 hours via WhatsApp or email.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <Link href="/" style={{ backgroundColor: "#C39529", color: "#000", borderRadius: 100, padding: "14px 26px", textDecoration: "none", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Back Home
                </Link>
                <a href="https://wa.me/2348149799150" target="_blank" rel="noreferrer" style={{ border: "1px solid rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.72)", borderRadius: 100, padding: "14px 26px", textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Contact Us
                </a>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 42 }} className="step-title-block">
                <h2 style={{ fontFamily: "'Morpha', Georgia, serif", fontWeight: 400, fontSize: 30, color: "white" }}>{steps[currentStep - 1]}</h2>
                <span className="step-indicator" style={{ color: "rgba(255,255,255,0.32)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>Step {currentStep} of 4</span>
              </div>

              {currentStep === 1 && (
                <>
                  <SectionLabel>Identity</SectionLabel>
                  <div className="application-grid">
                    <SelectField label="Title" name="title" values={values} setValues={setValues} options={["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof", "Engr", "Barr"]} required />
                    <TextField label="First Name" name="firstName" values={values} setValues={setValues} placeholder="First name" required />
                    <TextField label="Last Name" name="lastName" values={values} setValues={setValues} placeholder="Last name" required />
                    <TextField label="Other Names" name="otherNames" values={values} setValues={setValues} placeholder="Middle / other names" />
                    <RadioGroup label="Gender" name="gender" values={values} setValues={setValues} options={["Male", "Female"]} required />
                    <TextField label="Date of Birth" name="dateOfBirth" values={values} setValues={setValues} type="date" required />
                    <SelectField label="Marital Status" name="maritalStatus" values={values} setValues={setValues} options={["Single", "Married", "Divorced", "Widowed", "Separated"]} required />
                    <SelectField label="Number of Children" name="numChildren" values={values} setValues={setValues} options={["0", "1", "2", "3", "4", "5+"]} />
                    <SelectField label="State of Origin" name="stateOfOrigin" values={values} setValues={setValues} options={states} required />
                    <TextField label="LGA of Origin" name="lgaOfOrigin" values={values} setValues={setValues} placeholder="Enter LGA of origin" required />
                  </div>

                  <div style={{ marginTop: 52 }}>
                    <SectionLabel>Contact Details</SectionLabel>
                    <div className="application-grid">
                      <TextField label="Phone Number" name="phoneNumber" values={values} setValues={setValues} type="tel" placeholder="e.g. 08012345678" required />
                      <TextField label="Email Address" name="emailAddress" values={values} setValues={setValues} type="email" placeholder="your@email.com" required />
                      <div className="field-full"><TextField label="Home Address" name="homeAddress" values={values} setValues={setValues} placeholder="Full home address" required /></div>
                      <TextField label="Landmark / Nearest Bus Stop" name="landmark" values={values} setValues={setValues} placeholder="e.g. Opposite GTBank" />
                      <SelectField label="State of Residence" name="stateOfResidence" values={values} setValues={setValues} options={states} required />
                      <TextField label="LGA of Residence" name="lgaOfResidence" values={values} setValues={setValues} placeholder="Enter your LGA" required />
                      <div className="field-full"><RadioGroup label="Residential Status" name="residentialStatus" values={values} setValues={setValues} options={["Tenant", "Property Owner", "Living with Relative / Parent"]} required /></div>
                    </div>
                  </div>

                  <div style={{ marginTop: 52 }}>
                    <SectionLabel>Employment & Business</SectionLabel>
                    <div className="application-grid">
                      <TextField label="Occupation" name="occupation" values={values} setValues={setValues} placeholder="Your occupation / job title" required />
                      <TextField label="Employer / Business Name" name="employerName" values={values} setValues={setValues} placeholder="Company or business name" />
                      <div className="field-full"><TextField label="Office / Business Address" name="officeAddress" values={values} setValues={setValues} placeholder="Office or business address" /></div>
                      <div className="field-full"><RadioGroup label="Employment Type" name="employmentType" values={values} setValues={setValues} options={["Full Time", "Part Time", "Self Employed", "Retired"]} required /></div>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <SectionLabel>Government ID</SectionLabel>
                  <div className="application-grid">
                    <SelectField label="ID Type" name="idType" values={values} setValues={setValues} options={["National ID Card (NIMC)", "International Passport", "Driver's Licence", "Voter's Card (PVC)"]} required />
                    <TextField label="ID Card Number" name="idNumber" values={values} setValues={setValues} placeholder="Enter ID number" required />
                    <TextField label="ID Expiry Date" name="idExpiry" values={values} setValues={setValues} type="date" />
                    <TextField label="NIN" name="nin" values={values} setValues={setValues} placeholder="11-digit NIN" required />
                    <div className="field-full">
                      <TextField label="BVN" name="bvn" values={values} setValues={setValues} placeholder="11-digit BVN" required />
                      <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, lineHeight: 1.7, borderLeft: "2px solid #C39529", paddingLeft: 14, marginTop: 10 }}>
                        Your BVN is used solely for identity verification and credit assessment.
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: 52 }}>
                    <SectionLabel>Supporting Documents</SectionLabel>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>Accepted formats: JPG, PNG, PDF. Max 5MB per file.</p>
                    <div className="upload-grid">
                      <UploadBox title="Government Issued ID" subtitle="Passport, NIN card, Driver's Licence or PVC" name="governmentId" uploads={uploads} setUploads={setUploads} />
                      <UploadBox title="Passport Photograph" subtitle="Recent clear photo, white background preferred" name="passport" uploads={uploads} setUploads={setUploads} />
                      <UploadBox title="Proof of Income" subtitle="Bank statement (6 months) or salary payslip" name="income" uploads={uploads} setUploads={setUploads} />
                      <UploadBox title="Proof of Residence" subtitle="Current utility bill or residence evidence" name="residence" uploads={uploads} setUploads={setUploads} />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <SectionLabel>Browse Catalogue</SectionLabel>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>
                    Select a category, then choose your model.
                  </p>
                  <div className="category-grid">
                    {vehicleGroups.map((group) => {
                      const isActive = selectedCategory === group.category;
                      const modelPicked = group.models.includes(values.vehicleModel ?? "");
                      return (
                        <button
                          key={group.category}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(group.category);
                            if (!modelPicked) setValues((c) => ({ ...c, vehicleModel: "" }));
                          }}
                          style={{
                            position: "relative",
                            border: isActive || modelPicked ? "1px solid #C39529" : "1px solid rgba(255,255,255,0.1)",
                            backgroundColor: isActive || modelPicked ? "rgba(195,149,41,0.07)" : "rgba(255,255,255,0.03)",
                            borderRadius: 14,
                            padding: "24px 16px 18px",
                            cursor: "pointer",
                            textAlign: "center",
                            color: isActive || modelPicked ? "#C39529" : "rgba(255,255,255,0.45)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span className="score-info-icon" style={{ position: "absolute", top: 12, left: 12 }} aria-label={categoryDescriptions[group.category]}>
                            <span className="score-tooltip">{categoryDescriptions[group.category]}</span>
                            i
                          </span>
                          <span style={{ position: "absolute", top: 12, right: 12, width: 15, height: 15, borderRadius: 3, border: isActive || modelPicked ? "none" : "1.5px solid rgba(255,255,255,0.16)", backgroundColor: isActive || modelPicked ? "#C39529" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {(isActive || modelPicked) && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <polyline points="1 3.5 3.5 6 8 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                            {group.category}
                          </span>
                          {group.category === "Tavet Models" ? (
                            <img
                              src={tavetOutline.src}
                              alt="Tavet"
                              width={320}
                              height={118}
                              style={{
                                objectFit: "contain",
                                filter: isActive || modelPicked
                                  ? "brightness(0) saturate(100%) invert(61%) sepia(57%) saturate(677%) hue-rotate(6deg) brightness(98%) contrast(95%)"
                                  : "brightness(0) invert(1) opacity(0.6)",
                              }}
                            />
                          ) : group.category === "SUVs" ? (
                            <img
                              src={suvOutline.src}
                              alt="SUV"
                              width={320}
                              height={118}
                              style={{
                                objectFit: "contain",
                                filter: isActive || modelPicked
                                  ? "brightness(0) saturate(100%) invert(61%) sepia(57%) saturate(677%) hue-rotate(6deg) brightness(98%) contrast(95%)"
                                  : "brightness(0) invert(1) opacity(0.6)",
                              }}
                            />
                          ) : group.category === "Pickup Trucks" ? (
                            <img
                              src={pickupOutline.src}
                              alt="Pickup"
                              width={320}
                              height={118}
                              style={{
                                objectFit: "contain",
                                filter: isActive || modelPicked
                                  ? "brightness(0) saturate(100%) invert(61%) sepia(57%) saturate(677%) hue-rotate(6deg) brightness(98%) contrast(95%)"
                                  : "brightness(0) invert(1) opacity(0.6)",
                              }}
                            />
                          ) : group.category === "Sedans" ? (
                            <img
                              src={sedanOutline.src}
                              alt="Sedan"
                              width={320}
                              height={118}
                              style={{
                                objectFit: "contain",
                                filter: isActive || modelPicked
                                  ? "brightness(0) saturate(100%) invert(61%) sepia(57%) saturate(677%) hue-rotate(6deg) brightness(98%) contrast(95%)"
                                  : "brightness(0) invert(1) opacity(0.6)",
                              }}
                            />
                          ) : group.category === "Buses" ? (
                            <img
                              src={busOutline.src}
                              alt="Bus"
                              width={320}
                              height={118}
                              style={{
                                objectFit: "contain",
                                filter: isActive || modelPicked
                                  ? "brightness(0) saturate(100%) invert(61%) sepia(57%) saturate(677%) hue-rotate(6deg) brightness(98%) contrast(95%)"
                                  : "brightness(0) invert(1) opacity(0.6)",
                              }}
                            />
                          ) : categoryIcons[group.category]}
                        </button>
                      );
                    })}
                  </div>

                  {selectedCategory && (
                    <div style={{ marginTop: 32, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <FieldLabel required>Select Model</FieldLabel>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 6 }}>
                        {vehicleGroups.find((g) => g.category === selectedCategory)?.models.map((model) => {
                          const sel = values.vehicleModel === model;
                          return (
                            <button
                              key={model}
                              type="button"
                              onClick={() => setValues((c) => ({ ...c, vehicleModel: model }))}
                              style={{
                                border: sel ? "1px solid #C39529" : "1px solid rgba(255,255,255,0.1)",
                                backgroundColor: sel ? "rgba(195,149,41,0.12)" : "rgba(255,255,255,0.045)",
                                color: sel ? "#C39529" : "rgba(255,255,255,0.62)",
                                borderRadius: 100,
                                padding: "10px 20px",
                                fontSize: 13,
                                fontWeight: sel ? 600 : 400,
                                cursor: "pointer",
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              {model}
                            </button>
                          );
                        })}
                      </div>
                      <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
                        Not sure?{" "}
                        <a
                          href={vehicleGroups.find((g) => g.category === selectedCategory)?.site}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#C39529", textDecoration: "none" }}
                        >
                          Browse the {selectedCategory} lineup →
                        </a>
                      </p>
                    </div>
                  )}
                </>
              )}

              {currentStep === 4 && (
                <>
                  <SectionLabel>Declaration</SectionLabel>
                  <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, backgroundColor: "rgba(255,255,255,0.045)", padding: 28, marginBottom: 36 }}>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.9, marginBottom: 22 }}>
                      By submitting this application, I confirm that all information provided is true and complete. I authorise Nord Finance to verify information provided, process my personal data for credit assessment, and contact me regarding this application.
                    </p>
                      <button
                        type="button"
                      onClick={() => setConsent((current) => !current)}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        border: "none",
                        background: "transparent",
                        color: "rgba(255,255,255,0.72)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: 4, border: consent ? "none" : "1px solid rgba(255,255,255,0.2)", backgroundColor: consent ? "#C39529" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {consent && (
                          <svg width="11" height="8" viewBox="0 0 9 7" fill="none">
                            <polyline points="1 3.5 3.5 6 8 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span style={{ fontSize: 13, lineHeight: 1.7 }}>I agree to the declaration and consent to the processing of my personal data by Nord Finance.</span>
                    </button>
                  </div>

                  <SectionLabel>Application Summary</SectionLabel>
                  <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, backgroundColor: "rgba(255,255,255,0.045)", padding: 24 }}>
                    {summary.map(([label, value], index) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 24, padding: "10px 0", borderBottom: index === summary.length - 1 ? "none" : "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ color: "#C39529", fontSize: 12 }}>{label}</span>
                        <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 12, textAlign: "right" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <StepNav
                currentStep={currentStep}
                setStep={setStep}
                submit={submitApplication}
                canProceed={stepIsComplete(currentStep, values, consent)}
                onBack={() => setStep(currentStep - 1)}
                onCancel={() => setShowCancelModal(true)}
              />
            </>
          )}
        </div>
      </section>

      <style>{`
        .application-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 20px;
        }
        .field-full {
          grid-column: 1 / -1;
        }
        .upload-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .score-info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.4);
          font-size: 9px;
          font-style: italic;
          font-weight: 700;
          cursor: default;
          position: relative;
          flex-shrink: 0;
        }
        .score-tooltip {
          display: none;
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--text-muted);
          font-size: 11px;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          line-height: 1.6;
          padding: 10px 13px;
          border-radius: 8px;
          width: 200px;
          white-space: normal;
          pointer-events: none;
          z-index: 10;
        }
        .score-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: rgba(255,255,255,0.12);
        }
        .score-info-icon:hover .score-tooltip {
          display: block;
        }
        .application-loader {
          animation: applicationSpin 0.9s linear infinite;
        }
        @keyframes applicationSpin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .application-shell {
            padding-left: 28px !important;
            padding-right: 28px !important;
          }
          .application-header-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .application-header-row h1,
          .application-header-row p {
            max-width: 100% !important;
          }
          .application-hero-eyebrow {
            justify-content: center !important;
          }
          .application-hero-eyebrow-end {
            display: inline !important;
          }
          .application-hero-copy {
            font-size: 15px !important;
            line-height: 1.85 !important;
          }
          .application-grid {
            grid-template-columns: 1fr !important;
          }
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          input, select, textarea { font-size: 1rem !important; }
          input[type="date"] { width: 100% !important; min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; appearance: none !important; -webkit-appearance: none !important; }
          .application-grid > *, .upload-grid > * { min-width: 0; overflow: hidden; }
          .step-title-block {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 8px !important;
          }
          .application-actions {
            flex-direction: column-reverse !important;
          }
          .application-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 400,
          backgroundColor: "rgba(0,0,0,0.76)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          <div style={{
            width: "min(420px, 100%)",
            backgroundColor: "rgba(10,10,10,0.95)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 18,
            padding: "36px 32px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          }}>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600, fontSize: 11,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "#C39529", marginBottom: 12,
            }}>
              Cancel Application
            </p>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400, fontSize: 14, lineHeight: 1.8,
              color: "rgba(255,255,255,0.65)", marginBottom: 28,
            }}>
              Are you sure you want to cancel? Your progress will not be saved.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  borderRadius: 100, padding: "12px 24px",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Keep Going
              </button>
              <button
                onClick={() => router.push("/credit-score?result=1")}
                style={{
                  border: "1px solid #C39529",
                  background: "transparent",
                  color: "#C39529",
                  borderRadius: 100, padding: "12px 24px",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
