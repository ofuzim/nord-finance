'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import tavetOutline from "@/imports/tavet-outline.svg";
import carLoaderSvg from "@/imports/car.svg";
import sedanOutline from "@/imports/sedan-outline.svg";
import suvOutline from "@/imports/suv-outline.svg";
import pickupOutline from "@/imports/pick-up-outline.svg";
import busOutline from "@/imports/bus-outline.svg";
import { getVehicleGroups, vehicles, type Vehicle } from "@/lib/vehicleCatalog";
import { getDocumentUploadUrl, saveDraftApplication, finalizeApplication, getDraftApplication, sendApplicationConfirmationEmail } from "@/app/actions/application";
import { getCreditScoreById } from "@/app/actions/credit-score";
import { defaultCreditScoreTiers, getCreditScoreTier, type CreditScoreTierConfig } from "@/lib/creditScoreModel";
import { defaultKycConfig, getKycGroupItems, isKycRequired, kycFieldGroups, type KycConfig } from "@/lib/kycConfig";

type FormValues = Record<string, string>;
type UploadedFile = { storagePath: string; fileName: string; fileSize: number; mimeType: string };
type UploadValues = Record<string, UploadedFile>;

const BYPASS_COMPLETION = process.env.NEXT_PUBLIC_BYPASS_COMPLETION === "true";

function stepIsComplete(step: number, values: FormValues, consent: boolean, kycConfig: KycConfig, uploads: UploadValues = {}): boolean {
  if (BYPASS_COMPLETION) return true;
  const v = (k: string) => !!values[k]?.trim();
  const required = (keys: string[]) => keys.filter((key) => isKycRequired(kycConfig, key));
  if (step === 1) return required([
    "title", "firstName", "lastName", "otherNames", "gender", "dateOfBirth", "maritalStatus", "numChildren",
    "stateOfOrigin", "lgaOfOrigin", "phoneNumber", "emailAddress", "homeAddress", "landmark",
    "stateOfResidence", "lgaOfResidence", "residentialStatus", "occupation", "employerName", "officeAddress", "employmentType",
  ]).every(v);
  if (step === 2) {
    const fieldsOk = required(["idType", "idNumber", "idExpiry", "nin", "bvn"]).every(v);
    const docsOk = required(["governmentId", "passport", "bankStatement", "payslip", "residence"]).every((key) => Boolean(uploads[key]));
    return fieldsOk && docsOk;
  }
  if (step === 3) return v("vehicleModel");
  if (step === 4) return consent;
  return true;
}

const steps = [
  "Personal Information",
  "Identity Verification",
  "Vehicle of Interest",
  "Consent And Submit",
];

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const kycGroupByTitle = Object.fromEntries(kycFieldGroups.map((group) => [group.title, group]));

const documentUploadMeta: Record<string, { title: string; subtitle: string }> = {
  governmentId: { title: "Government Issued ID", subtitle: "Passport, NIN card, Driver's Licence or PVC" },
  passport: { title: "Passport Photograph", subtitle: "Recent clear photo, white background preferred" },
  bankStatement: { title: "Bank Statement", subtitle: "Most recent 12 months" },
  payslip: { title: "Payslip", subtitle: "Recent salary payslip" },
  residence: { title: "Proof of Residence", subtitle: "Current utility bill or residence evidence" },
};

const categoryDescriptions: Record<string, string> = {
  "Sedans": "Passenger cars and sport coupés — comfortable, agile, and ideal for daily driving.",
  "SUVs": "Sport Utility Vehicles — spacious, high-riding, suited for families and varied terrain.",
  "Pickup Trucks": "Rugged trucks with an open cargo bed — built for work and off-road capability.",
  "Buses": "Commercial passenger buses — designed for group transport and fleet operations.",
  "Electric Vehicles": "Fully electric vehicles from Tavet by Nord, built for efficient city, sedan, and logistics use cases.",
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
  "Electric Vehicles": (
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function UploadBox({
  title,
  subtitle,
  name,
  uploads,
  required,
  onUploaded,
  onUploadStart,
  onUploadEnd,
}: {
  title: string;
  subtitle: string;
  name: string;
  uploads: UploadValues;
  required?: boolean;
  onUploaded: (name: string, file: UploadedFile) => void;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}) {
  const existing = uploads[name];
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(existing ? "done" : "idle");
  const [displayName, setDisplayName] = useState<string | null>(existing?.fileName ?? null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setStatus("error");
      setErrorMsg("File too large. Max 5MB.");
      return;
    }
    setStatus("uploading");
    setDisplayName(file.name);
    setErrorMsg(null);
    onUploadStart();
    try {
      const ext = file.name.split(".").pop() ?? "bin";

      // Get a signed upload URL from the server (tiny request — no file data)
      const urlResult = await getDocumentUploadUrl(name, ext);
      if ("error" in urlResult) {
        setStatus("error");
        setErrorMsg(urlResult.error);
        return;
      }

      // Upload directly from browser to Supabase Storage via signed URL
      const uploadRes = await fetch(urlResult.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        const body = await uploadRes.text().catch(() => "");
        setStatus("error");
        setErrorMsg(`Upload failed (${uploadRes.status}). Please try again.`);
        console.error("Storage upload error:", uploadRes.status, body);
        onUploadEnd();
        return;
      }

      setStatus("done");
      onUploadEnd();
      onUploaded(name, { storagePath: urlResult.storagePath, fileName: file.name, fileSize: file.size, mimeType: file.type });
    } catch {
      setStatus("error");
      setErrorMsg("Upload failed. Please try again.");
      onUploadEnd();
    }
  };

  const isDone = status === "done";
  const isUploading = status === "uploading";
  const isError = status === "error";

  return (
    <label
      style={{
        display: "block",
        border: isDone ? "1px dashed rgba(34,197,94,0.55)" : isError ? "1px dashed rgba(239,68,68,0.5)" : "1px dashed rgba(255,255,255,0.14)",
        backgroundColor: isDone ? "rgba(34,197,94,0.06)" : isError ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.045)",
        borderRadius: 14,
        padding: 24,
        cursor: isUploading ? "default" : "pointer",
        textAlign: "center",
        pointerEvents: isUploading ? "none" : "auto",
      }}
    >
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
        {isUploading ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C39529" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#C39529">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
            </path>
          </svg>
        ) : isDone ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : isError ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        )}
      </div>
      <p style={{ color: "white", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title} {required && <span style={{ color: "#C39529" }}>*</span>}</p>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, lineHeight: 1.6 }}>{subtitle}</p>
      {isUploading && <p style={{ color: "#C39529", fontSize: 12, marginTop: 10 }}>Uploading…</p>}
      {isDone && <p style={{ color: "#22c55e", fontSize: 12, marginTop: 10 }}>{displayName}</p>}
      {isError && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 10 }}>Upload failed — tap to retry</p>}
    </label>
  );
}

function ApplicationSuccessCarLoader() {
  const carRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const host = carRef.current;
    const speed = speedRef.current;

    if (!host || !speed) return;

    async function buildLoader() {
      const res = await fetch(carLoaderSvg.src);
      const txt = await res.text();
      if (cancelled || !host || !speed) return;

      host.innerHTML = txt;

      const svg = host.querySelector("svg");
      if (svg) {
        const wheels = [
          { cx: 144.66, cy: 208.57, paths: [] as SVGGraphicsElement[] },
          { cx: 462.86, cy: 208.57, paths: [] as SVGGraphicsElement[] },
        ];
        const R = 32;
        const allPaths = Array.from(svg.querySelectorAll<SVGGraphicsElement>("path"));

        allPaths.forEach((path) => {
          let bbox: DOMRect;
          try {
            bbox = path.getBBox();
          } catch {
            return;
          }

          const cx = bbox.x + bbox.width / 2;
          const cy = bbox.y + bbox.height / 2;

          for (const wheel of wheels) {
            if (Math.abs(cx - wheel.cx) < R && Math.abs(cy - wheel.cy) < R) {
              wheel.paths.push(path);
              break;
            }
          }
        });

        wheels.forEach((wheel) => {
          if (!wheel.paths.length) return;

          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          g.setAttribute("class", "wheel");
          wheel.paths[0].parentNode?.insertBefore(g, wheel.paths[0]);
          wheel.paths.forEach((path) => g.appendChild(path));

          const bbox = g.getBBox();
          const ox = bbox.x + bbox.width / 2;
          const oy = bbox.y + bbox.height / 2;
          g.style.transformOrigin = `${ox}px ${oy}px`;
        });
      }

      speed.innerHTML = "";
      const N = 9;
      for (let i = 0; i < N; i++) {
        const span = document.createElement("span");
        const top = 6 + i * (88 / N) + (Math.random() * 4 - 2);
        const len = 18 + Math.random() * 28;
        const dur = 0.5 + Math.random() * 0.9;
        const delay = -Math.random() * dur;
        span.style.top = `${top}%`;
        span.style.width = `${len}%`;
        span.style.left = `${60 + Math.random() * 30}%`;
        span.style.animationDuration = `${dur}s`;
        span.style.animationDelay = `${delay}s`;
        span.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
        speed.appendChild(span);
      }
    }

    buildLoader().catch(() => {});

    return () => {
      cancelled = true;
      host.innerHTML = "";
      speed.innerHTML = "";
    };
  }, []);

  return (
    <div className="success-loader-stage" role="status" aria-live="polite" aria-label="Loading">
      <div className="success-loader-scene">
        <div className="success-loader-speed" ref={speedRef} aria-hidden="true" />
        <div className="success-loader-exhaust" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="success-loader-car" ref={carRef} aria-hidden="true" />
      </div>
      <style>{`
        .success-loader-stage {
          width: min(520px, 82vw);
          margin: 0 auto 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 36px;
        }

        .success-loader-scene {
          position: relative;
          width: 100%;
          aspect-ratio: 593 / 326;
          overflow: visible;
        }

        .success-loader-speed {
          position: absolute;
          inset: 8% -6% 22% -6%;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.55;
        }

        .success-loader-speed span {
          position: absolute;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(184, 184, 180, 0.65), transparent);
          border-radius: 2px;
          animation: success-loader-whoosh linear infinite;
          will-change: transform, opacity;
        }

        .success-loader-car {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .success-loader-car svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }

        .success-loader-exhaust {
          position: absolute;
          left: 11%;
          top: 58%;
          width: 18%;
          height: 22%;
          pointer-events: none;
        }

        .success-loader-exhaust span {
          position: absolute;
          left: 0;
          top: 50%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(184, 184, 180, 0.35);
          animation: success-loader-puff 1.6s ease-out infinite;
          will-change: transform, opacity;
        }

        .success-loader-exhaust span:nth-child(2) { animation-delay: 0.4s; }
        .success-loader-exhaust span:nth-child(3) { animation-delay: 0.8s; }
        .success-loader-exhaust span:nth-child(4) { animation-delay: 1.2s; }

        @keyframes success-loader-whoosh {
          0% { transform: translateX(110%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(-220%); opacity: 0; }
        }

        .success-loader-car .wheel {
          transform-box: view-box;
          transform: rotate(0deg);
          animation: success-loader-spin 0.55s linear infinite;
          will-change: transform;
        }

        @keyframes success-loader-puff {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
          15% { opacity: 0.55; }
          100% { transform: translate(-70px, -14px) scale(2.4); opacity: 0; }
        }

        @keyframes success-loader-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .success-loader-car svg path,
        .success-loader-car svg rect.cls-2 {
          fill: #b8b8b4;
        }

        .success-loader-car svg rect.cls-1 {
          fill: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .success-loader-speed span,
          .success-loader-car,
          .success-loader-car .wheel,
          .success-loader-exhaust span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function StepNav({
  currentStep,
  setStep,
  submit,
  canProceed,
  isContinuing = false,
  isSubmitting = false,
  onBack,
  onCancel,
}: {
  currentStep: number;
  setStep: (step: number) => void;
  submit?: () => void;
  canProceed: boolean;
  isContinuing?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onCancel: () => void;
}) {
  const isFinalStep = currentStep === 4;
  const isLoading = isFinalStep ? isSubmitting : isContinuing;
  const disabled = !canProceed || isLoading;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginTop: 44 }} className="application-actions">
      <button
        type="button"
        disabled={isLoading}
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
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {currentStep === 1 ? "Cancel" : "Back"}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (isFinalStep ? submit?.() : setStep(currentStep + 1))}
        style={{
          border: isFinalStep ? "none" : "1px solid #C39529",
          backgroundColor: isFinalStep ? "#C39529" : "transparent",
          color: isFinalStep ? "#000" : "#C39529",
          borderRadius: 100,
          padding: "14px 36px",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.35 : 1,
          transition: "opacity 0.2s ease",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minWidth: 146,
        }}
      >
        {isLoading && <span className="application-button-loader" aria-hidden="true" />}
        {isLoading ? (isFinalStep ? "Submitting" : "Loading") : isFinalStep ? "Submit Application" : "Continue"}
      </button>
    </div>
  );
}

export function ApplicationFormPage({ tiers = defaultCreditScoreTiers, kycConfig = defaultKycConfig, vehicleCatalog = vehicles }: { tiers?: CreditScoreTierConfig[]; kycConfig?: KycConfig; vehicleCatalog?: Vehicle[] }) {
  const searchParams = useSearchParams();
  const carriedScore = searchParams.get("score");
  const carriedTier = searchParams.get("tier");
  const carriedFirstName = searchParams.get("firstName") ?? "";
  const carriedLastName = searchParams.get("lastName") ?? "";
  const carriedEmail = searchParams.get("email") ?? "";
  const carriedEmploymentType = searchParams.get("employmentType") ?? "";
  const carriedMonthlyIncome = searchParams.get("monthlyIncome") ?? "";
  const carriedDownPayment = searchParams.get("downPayment") ?? "";
  const carriedScoreId = searchParams.get("scoreId") ?? "";
  const resumeId = searchParams.get("id") ?? "";
  const carriedReferenceNumber = searchParams.get("reference") ?? "";

  const formRef = React.useRef<HTMLDivElement>(null);

  const stepParam = searchParams.get("step");
  const initialSuccess = stepParam === "success";
  const initialStep = initialSuccess ? steps.length : Math.min(Math.max(parseInt(stepParam ?? "1", 10) || 1, 1), steps.length);
  const [currentStep, setCurrentStepState] = useState(initialStep);
  const [success, setSuccess] = useState(initialSuccess);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(carriedReferenceNumber || null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadValues>({});
  const [activeUploads, setActiveUploads] = useState(0);
  const [applicationId, setApplicationId] = useState<string | null>(resumeId || null);
  const [refCopied, setRefCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState<string | null>(carriedScore || null);
  const [displayTier, setDisplayTier] = useState<string | null>(carriedTier || null);
  const applicationUrlRef = useRef("");
  const currentStepRef = useRef(initialStep);
  const successRef = useRef(initialSuccess);
  const continueTimerRef = useRef<number | null>(null);
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
  const req = useCallback((key: string) => isKycRequired(kycConfig, key), [kycConfig]);
  const vehicleGroups = useMemo(() => getVehicleGroups(vehicleCatalog), [vehicleCatalog]);
  const kycItemsFor = useCallback((title: string) => {
    const group = kycGroupByTitle[title];
    return group ? getKycGroupItems(group, kycConfig).map(([key]) => key) : [];
  }, [kycConfig]);
  const hasCreditScoreSummary = Boolean(carriedScoreId || displayScore || displayTier);

  const creditScoreBackUrl = carriedScoreId
    ? `/credit-score/results/${carriedScoreId}`
    : "/credit-score?result=1";

  const getSuccessBackUrl = useCallback(() => {
    if (carriedScoreId) return `/credit-score/results/${carriedScoreId}`;
    try {
      return sessionStorage.getItem("nord_application_success_back_url") || creditScoreBackUrl;
    } catch {
      return creditScoreBackUrl;
    }
  }, [carriedScoreId, creditScoreBackUrl]);

  useEffect(() => {
    if (!carriedScoreId) return;
    try {
      sessionStorage.setItem("nord_application_success_back_url", `/credit-score/results/${carriedScoreId}`);
    } catch {}
  }, [carriedScoreId]);

  // Load draft from DB when resuming via ?id=
  useEffect(() => {
    if (!resumeId) return;
    getDraftApplication(resumeId).then((result) => {
      if ("error" in result) return;
      if (result.referenceNumber && !referenceNumber) {
        setReferenceNumber(result.referenceNumber);
      }
      if (result.status !== "draft") {
        setSuccess(true);
        const params = new URLSearchParams();
        params.set("id", resumeId);
        params.set("step", "success");
        applicationUrlRef.current = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", `?${params.toString()}`);
        return;
      }
      setValues((current) => ({ ...current, ...result.fields }));
      if (!stepParam && result.step) {
        setCurrentStepState(Math.min(Math.max(result.step, 1), steps.length));
      }
      if (result.fields.vehicleModel) {
        const group = vehicleGroups.find((g) => g.models.includes(result.fields.vehicleModel));
        if (group) setSelectedCategory(group.category);
      }
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill financial fields from score record; set display score/tier; clean redundant URL params
  useEffect(() => {
    if (!carriedScoreId) return;
    getCreditScoreById(carriedScoreId).then((result) => {
      if ("error" in result) return;
      let sessionIdentity: { firstName?: string; lastName?: string; email?: string } = {};
      try {
        const saved = sessionStorage.getItem("nord_credit_score_state");
        const parsed = saved ? JSON.parse(saved) : null;
        sessionIdentity = parsed?.identity ?? {};
      } catch {}
      setValues((current) => ({
        ...current,
        firstName: current.firstName || result.firstName || sessionIdentity.firstName || "",
        lastName: current.lastName || result.lastName || sessionIdentity.lastName || "",
        emailAddress: current.emailAddress || result.email || sessionIdentity.email || "",
        monthlyIncome: current.monthlyIncome || String(result.monthlyIncome),
        downPayment: current.downPayment || String(result.downPayment),
      }));
      setDisplayScore(String(result.score));
      setDisplayTier(getCreditScoreTier(result.score, tiers).name);
      const params = new URLSearchParams(window.location.search);
      const redundant = ["score", "tier", "firstName", "lastName", "email", "employmentType", "monthlyIncome", "downPayment"];
      if (redundant.some((k) => params.has(k))) {
        redundant.forEach((k) => params.delete(k));
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
      }
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progress = success ? 100 : (currentStep / steps.length) * 100;

  useEffect(() => {
    successRef.current = success;
  }, [success]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  const scrollToFormSection = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (formRef.current) {
      const headerOffset = 72;
      const top = formRef.current.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior });
    }
  }, []);

  const scheduleFormScroll = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      scrollToFormSection(behavior);
      window.setTimeout(() => scrollToFormSection(behavior), 80);
    });
  }, [scrollToFormSection]);

  useEffect(() => {
    applicationUrlRef.current = `${window.location.pathname}${window.location.search}`;
    window.history.pushState({ nordApplicationGuard: true }, "", applicationUrlRef.current);

    const handleBrowserBack = () => {
      if (window.location.pathname === "/application") {
        const params = new URLSearchParams(window.location.search);
        const stepParamFromUrl = params.get("step");

        // Once submitted, browser back should leave the confirmation page.
        if (successRef.current) {
          window.location.assign(getSuccessBackUrl());
          return;
        }

        if (stepParamFromUrl === "success") {
          setSuccess(true);
          applicationUrlRef.current = `${window.location.pathname}${window.location.search}`;
          return;
        }

        const stepFromUrl = Math.min(Math.max(parseInt(stepParamFromUrl ?? "1", 10) || 1, 1), steps.length);

        if (currentStepRef.current === 1 && stepFromUrl === 1) {
          const currentApplicationUrl =
            applicationUrlRef.current || `${window.location.pathname}${window.location.search}`;
          window.history.pushState({ nordApplicationGuard: true }, "", currentApplicationUrl);
          setShowCancelModal(true);
          return;
        }

        setSuccess(false);
        setCurrentStepState(stepFromUrl);
        applicationUrlRef.current = `${window.location.pathname}${window.location.search}`;
        scheduleFormScroll();
        return;
      }

      // Outside /application entirely
      if (successRef.current) {
        window.location.assign(getSuccessBackUrl());
        return;
      }

      const currentApplicationUrl =
        applicationUrlRef.current || `/application${window.location.search}`;
      window.history.pushState({ nordApplicationGuard: true }, "", currentApplicationUrl);
      setShowCancelModal(true);
    };

    window.addEventListener("popstate", handleBrowserBack);
    return () => {
      window.removeEventListener("popstate", handleBrowserBack);
    };
  }, [getSuccessBackUrl, scheduleFormScroll]);

  const setStep = (step: number, scrollBehavior: ScrollBehavior = "smooth", appId?: string) => {
    setSuccess(false);
    setCurrentStepState(step);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(step));
    const idToUse = appId ?? applicationId;
    if (idToUse) params.set("id", idToUse);
    const nextUrl = `?${params.toString()}`;
    applicationUrlRef.current = `${window.location.pathname}${nextUrl}`;
    window.history.pushState(null, "", nextUrl);
    scheduleFormScroll(scrollBehavior);
  };

  const continueToStep = async (step: number) => {
    if (isContinuing) return;
    setIsContinuing(true);

    const wait = (ms: number) => new Promise<void>(r => { continueTimerRef.current = window.setTimeout(() => { continueTimerRef.current = null; r(); }, ms); });

    // Save draft in parallel with the animation delay
    const [saveResult] = await Promise.all([
      saveDraftApplication({
        values,
        applicationId,
        creditScoreId: carriedScoreId || null,
        currentStep: step,
      }).catch(() => null),
      wait(420),
    ]);

    let newAppId = applicationId;
    if (saveResult && 'id' in saveResult) {
      newAppId = saveResult.id;
      setApplicationId(newAppId);
    }

    const scrollBehavior = window.matchMedia("(max-width: 960px)").matches ? "auto" : "smooth";
    setStep(step, scrollBehavior, newAppId ?? undefined);
    setIsContinuing(false);
  };

  useEffect(() => {
    return () => {
      if (continueTimerRef.current !== null) {
        window.clearTimeout(continueTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!success) return;

    const scrollToPageTop = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    requestAnimationFrame(() => {
      scrollToPageTop();
      window.setTimeout(scrollToPageTop, 120);
      window.setTimeout(scrollToPageTop, 360);
    });
  }, [success]);

  const selectedVehicle = values.vehicleModel;

  const summary = useMemo(
    () => [
      ["Applicant", `${values.firstName ?? ""} ${values.lastName ?? ""}`.trim() || "--"],
      ["Email", values.emailAddress || "--"],
      ["Phone", values.phoneNumber || "--"],
      ["Employment", values.employmentType || "--"],
      ["Residential Status", values.residentialStatus || "--"],
      ["Vehicle of Interest", selectedVehicle || "--"],
      ["Score / Tier", displayScore && displayTier ? `${displayScore} - ${displayTier}` : "--"],
      ["Monthly Income", values.monthlyIncome ? `N${Number(values.monthlyIncome).toLocaleString("en-NG")}` : "--"],
      ["Down Payment", values.downPayment ? `${values.downPayment}%` : "--"],
      ["BVN Provided", values.bvn ? "Yes" : "No"],
      ["NIN Provided", values.nin ? "Yes" : "No"],
    ],
    [displayScore, displayTier, selectedVehicle, values]
  );

  const submitApplication = async () => {
    if (isSubmitting) return;
    if (!consent && !BYPASS_COMPLETION) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Ensure we have a draft application record (should already exist from step advances)
      let appId = applicationId;
      if (!appId) {
        const draft = await saveDraftApplication({
          values,
          applicationId: null,
          creditScoreId: carriedScoreId || null,
          currentStep,
        });
        if ("error" in draft) {
          setSubmitError("Failed to save application. Please try again.");
          setIsSubmitting(false);
          return;
        }
        appId = draft.id;
        setApplicationId(appId);
      }

      let creditScoreId: string | null = carriedScoreId || null;
      try {
        const saved = sessionStorage.getItem("nord_credit_score_state");
        const parsed = saved ? JSON.parse(saved) : null;
        if (parsed?.creditScoreId) creditScoreId = parsed.creditScoreId;
      } catch {}

      // Finalize: set status to submitted, insert documents, link score, send email
      const result = await finalizeApplication({ applicationId: appId, creditScoreId, fileUploads: uploads });

      if ("error" in result) {
        setSubmitError("Submission failed. Please try again or contact us.");
        setIsSubmitting(false);
        return;
      }

      setReferenceNumber(result.referenceNumber);
      setIsSubmitting(false);
      setSuccess(true);
      void sendApplicationConfirmationEmail({ applicationId: appId }).catch(() => null);
      const params = new URLSearchParams();
      params.set("id", appId);
      params.set("step", "success");
      const successUrl = `?${params.toString()}`;
      applicationUrlRef.current = `${window.location.pathname}${successUrl}`;
      window.history.replaceState(null, "", successUrl);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const renderKycField = (key: string) => {
    switch (key) {
      case "title":
        return <SelectField label="Title" name="title" values={values} setValues={setValues} options={["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof", "Engr", "Barr"]} required={req("title")} />;
      case "firstName":
        return <TextField label="First Name" name="firstName" values={values} setValues={setValues} placeholder="First name" required={req("firstName")} />;
      case "lastName":
        return <TextField label="Last Name" name="lastName" values={values} setValues={setValues} placeholder="Last name" required={req("lastName")} />;
      case "otherNames":
        return <TextField label="Other Names" name="otherNames" values={values} setValues={setValues} placeholder="Middle / other names" required={req("otherNames")} />;
      case "gender":
        return <RadioGroup label="Gender" name="gender" values={values} setValues={setValues} options={["Male", "Female"]} required={req("gender")} />;
      case "dateOfBirth":
        return <TextField label="Date of Birth" name="dateOfBirth" values={values} setValues={setValues} type="date" required={req("dateOfBirth")} />;
      case "maritalStatus":
        return <SelectField label="Marital Status" name="maritalStatus" values={values} setValues={setValues} options={["Single", "Married", "Divorced", "Widowed", "Separated"]} required={req("maritalStatus")} />;
      case "numChildren":
        return <SelectField label="Number of Children" name="numChildren" values={values} setValues={setValues} options={["0", "1", "2", "3", "4", "5+"]} required={req("numChildren")} />;
      case "stateOfOrigin":
        return <SelectField label="State of Origin" name="stateOfOrigin" values={values} setValues={setValues} options={states} required={req("stateOfOrigin")} />;
      case "lgaOfOrigin":
        return <TextField label="LGA of Origin" name="lgaOfOrigin" values={values} setValues={setValues} placeholder="Enter LGA of origin" required={req("lgaOfOrigin")} />;
      case "phoneNumber":
        return <TextField label="Phone Number" name="phoneNumber" values={values} setValues={setValues} type="tel" placeholder="e.g. 08012345678" required={req("phoneNumber")} />;
      case "emailAddress":
        return <TextField label="Email Address" name="emailAddress" values={values} setValues={setValues} type="email" placeholder="your@email.com" required={req("emailAddress")} />;
      case "homeAddress":
        return <div className="field-full"><TextField label="Home Address" name="homeAddress" values={values} setValues={setValues} placeholder="Full home address" required={req("homeAddress")} /></div>;
      case "landmark":
        return <TextField label="Landmark / Nearest Bus Stop" name="landmark" values={values} setValues={setValues} placeholder="e.g. Opposite GTBank" required={req("landmark")} />;
      case "stateOfResidence":
        return <SelectField label="State of Residence" name="stateOfResidence" values={values} setValues={setValues} options={states} required={req("stateOfResidence")} />;
      case "lgaOfResidence":
        return <TextField label="LGA of Residence" name="lgaOfResidence" values={values} setValues={setValues} placeholder="Enter your LGA" required={req("lgaOfResidence")} />;
      case "residentialStatus":
        return <div className="field-full"><RadioGroup label="Residential Status" name="residentialStatus" values={values} setValues={setValues} options={["Tenant", "Property Owner", "Living with Relative / Parent"]} required={req("residentialStatus")} /></div>;
      case "occupation":
        return <TextField label="Occupation" name="occupation" values={values} setValues={setValues} placeholder="Your occupation / job title" required={req("occupation")} />;
      case "employerName":
        return <TextField label="Employer / Business Name" name="employerName" values={values} setValues={setValues} placeholder="Company or business name" required={req("employerName")} />;
      case "officeAddress":
        return <div className="field-full"><TextField label="Office / Business Address" name="officeAddress" values={values} setValues={setValues} placeholder="Office or business address" required={req("officeAddress")} /></div>;
      case "employmentType":
        return <div className="field-full"><RadioGroup label="Employment Type" name="employmentType" values={values} setValues={setValues} options={["Full Time", "Part Time", "Self Employed", "Retired"]} required={req("employmentType")} /></div>;
      case "idType":
        return <SelectField label="ID Type" name="idType" values={values} setValues={setValues} options={["National ID Card (NIMC)", "International Passport", "Driver's Licence", "Voter's Card (PVC)"]} required={req("idType")} />;
      case "idNumber":
        return <TextField label="ID Card Number" name="idNumber" values={values} setValues={setValues} placeholder="Enter ID number" required={req("idNumber")} />;
      case "idExpiry":
        return <TextField label="ID Expiry Date" name="idExpiry" values={values} setValues={setValues} type="date" required={req("idExpiry")} />;
      case "nin":
        return <TextField label="NIN" name="nin" values={values} setValues={setValues} placeholder="11-digit NIN" required={req("nin")} />;
      case "bvn":
        return (
          <div className="field-full">
            <TextField label="BVN" name="bvn" values={values} setValues={setValues} placeholder="11-digit BVN" required={req("bvn")} />
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, lineHeight: 1.7, borderLeft: "2px solid #C39529", paddingLeft: 14, marginTop: 10 }}>
              Your BVN is used solely for identity verification and credit assessment.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderKycUpload = (fieldName: string) => {
    const meta = documentUploadMeta[fieldName];
    if (!meta) return null;
    return (
      <UploadBox
        title={meta.title}
        subtitle={meta.subtitle}
        name={fieldName}
        uploads={uploads}
        required={req(fieldName)}
        onUploaded={(n, f) => setUploads(u => ({ ...u, [n]: f }))}
        onUploadStart={() => setActiveUploads(c => c + 1)}
        onUploadEnd={() => setActiveUploads(c => Math.max(0, c - 1))}
      />
    );
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
                {hasCreditScoreSummary && (
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
                      {displayScore ?? "--"}
                    </p>
                    {(displayTier || carriedScoreId) && (
                      <p
                        style={{
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          visibility: displayTier ? "visible" : "hidden",
                        }}
                        aria-hidden={!displayTier}
                      >
                        {displayTier ?? "Access Tier"}
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
              <ApplicationSuccessCarLoader />
              <h2 style={{ fontFamily: "'Morpha', Georgia, serif", fontSize: 52, lineHeight: 1.05, marginBottom: 18 }}>
                Application <em style={{ fontStyle: "normal", fontWeight: "bold" }}>Submitted</em>
              </h2>

              {referenceNumber && (
                <div style={{ marginBottom: 28, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "22px 32px", maxWidth: 400, width: "100%" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                    Your Reference Number
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
                    <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.12em", color: "#C39529", margin: 0 }}>
                      {referenceNumber}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(referenceNumber).then(() => {
                          setRefCopied(true);
                          setTimeout(() => setRefCopied(false), 2000);
                        }).catch(() => {});
                      }}
                      title="Copy reference number"
                      style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: refCopied ? "#22c55e" : "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", flexShrink: 0, transition: "color 0.2s ease" }}
                    >
                      {refCopied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                    Save this number. Use it to check your application status at{" "}
                    <Link href="/status" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "underline" }}>nordfinance.ng/status</Link>.
                  </p>
                </div>
              )}

              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.9, maxWidth: 560, margin: "0 auto 28px" }}>
                Thank you for your application. Our team will review your information and contact you within 24–48 hours via WhatsApp or email.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <Link href="/status" style={{ backgroundColor: "#C39529", color: "#000", borderRadius: 100, padding: "14px 26px", textDecoration: "none", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Track Application
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
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="step-indicator" style={{ color: "rgba(255,255,255,0.32)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>Step {currentStep} of 4</span>
                  {applicationId && currentStep < 4 && (
                    <button
                      type="button"
                      title="Copy resume link"
                      onClick={() => {
                        const params = new URLSearchParams(window.location.search);
                        params.set("id", applicationId);
                        params.set("step", String(currentStep));
                        const url = `${window.location.origin}/application?${params.toString()}`;
                        navigator.clipboard.writeText(url).then(() => {}).catch(() => {});
                        window.prompt("Copy your resume link:", url);
                      }}
                      style={{ background: "none", border: "none", padding: 4, cursor: "pointer", color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  )}
                </div>
              </div>

              {currentStep === 1 && (
                <>
                  <SectionLabel>Identity</SectionLabel>
                  <div className="application-grid">
                    {kycItemsFor("Identity").map((key) => <React.Fragment key={key}>{renderKycField(key)}</React.Fragment>)}
                  </div>

                  <div style={{ marginTop: 52 }}>
                    <SectionLabel>Contact Details</SectionLabel>
                    <div className="application-grid">
                      {kycItemsFor("Contact Details").map((key) => <React.Fragment key={key}>{renderKycField(key)}</React.Fragment>)}
                    </div>
                  </div>

                  <div style={{ marginTop: 52 }}>
                    <SectionLabel>Employment & Business</SectionLabel>
                    <div className="application-grid">
                      {kycItemsFor("Employment & Business").map((key) => <React.Fragment key={key}>{renderKycField(key)}</React.Fragment>)}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <SectionLabel>Government ID</SectionLabel>
                  <div className="application-grid">
                    {kycItemsFor("Government ID").map((key) => <React.Fragment key={key}>{renderKycField(key)}</React.Fragment>)}
                  </div>
                  <div style={{ marginTop: 52 }}>
                    <SectionLabel>Supporting Documents</SectionLabel>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>Accepted formats: JPG, PNG, PDF. Max 5MB per file.</p>
                    {activeUploads > 0 && (
                      <p style={{ color: "#C39529", fontSize: 12, marginBottom: 16 }}>
                        {activeUploads === 1 ? "1 file uploading" : `${activeUploads} files uploading`} — please wait before continuing.
                      </p>
                    )}
                    <div className="upload-grid">
                      {kycItemsFor("Supporting Documents").map((fieldName) => <React.Fragment key={fieldName}>{renderKycUpload(fieldName)}</React.Fragment>)}
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
                            setValues((c) => ({
                              ...c,
                              vehicleCategory: group.category,
                              vehicleModel: modelPicked ? c.vehicleModel : "",
                            }));
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
                          {group.category === "Electric Vehicles" ? (
                            <img
                              src={tavetOutline.src}
                              alt="Electric vehicle"
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
                          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                            {group.category}
                          </span>
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
                          href={
                            selectedCategory === "Electric Vehicles"
                              ? "https://nordmotion.com/vehicles/"
                              : vehicleGroups.find((g) => g.category === selectedCategory)?.site
                          }
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

              {submitError && (
                <div style={{ marginTop: 24, padding: "14px 18px", backgroundColor: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
                  <p style={{ color: "#ef4444", fontSize: 13, lineHeight: 1.7 }}>{submitError}</p>
                </div>
              )}

              <StepNav
                currentStep={currentStep}
                setStep={continueToStep}
                submit={submitApplication}
                canProceed={stepIsComplete(currentStep, values, consent, kycConfig, uploads) && activeUploads === 0}
                isContinuing={isContinuing}
                isSubmitting={isSubmitting}
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
          grid-template-columns: repeat(3, 1fr);
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
        .application-button-loader {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid currentColor;
          border-right-color: transparent;
          display: inline-block;
          animation: applicationSpin 0.75s linear infinite;
          flex: 0 0 auto;
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
          .upload-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          input, select, textarea { font-size: 1rem !important; }
          input[type="date"] { width: 100% !important; min-width: 0 !important; max-width: 100% !important; box-sizing: border-box !important; appearance: none !important; -webkit-appearance: none !important; }
          .upload-grid {
            grid-template-columns: 1fr !important;
          }
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
                onClick={() => window.location.assign(creditScoreBackUrl)}
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
