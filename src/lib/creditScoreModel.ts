export type CreditScoreOption = {
  label: string;
  value: number;
};

export type CreditScoreFormOption = CreditScoreOption;

export type CreditScoreFormField = {
  key: string;
  label: string;
  type?: 'select' | 'radio';
  options: CreditScoreFormOption[];
};

export type CreditScoreSliderKey = "monthlyIncome" | "obligations" | "downPayment";

export type CreditScoreSliderField = {
  key: CreditScoreSliderKey;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  scoreImpact: number;
  minLabel: string;
  maxLabel: string;
  format: "currency" | "percent" | "number";
};

export type CreditScoreSelectField = CreditScoreFormField;

export type CreditScoreFormItem =
  | ({ itemType: 'field' } & CreditScoreFormField)
  | ({ itemType: 'slider' } & CreditScoreSliderField)

export type CreditScoreFormSection = {
  id: string;
  title: string;
  weight: string;
  items: CreditScoreFormItem[];
};

export type CreditScoreSection = CreditScoreFormSection;

export function getSectionFields(section: CreditScoreFormSection): CreditScoreFormField[] {
  return section.items.filter((item): item is { itemType: 'field' } & CreditScoreFormField => item.itemType === 'field');
}

export function getSectionSliders(section: CreditScoreFormSection): CreditScoreSliderField[] {
  return section.items.filter((item): item is { itemType: 'slider' } & CreditScoreSliderField => item.itemType === 'slider');
}

export type CreditScoreFormConfig = CreditScoreFormSection[];

export type CreditScoreFormulaConfig = {
  base_score: number;
  multiplier: number;
  min_score: number;
  max_score: number;
};

export type CreditScoreTierConfig = {
  name: string;
  label: string;
  min_score: number;
  interest_rate: number;
  max_tenor_months: number;
  min_down_payment: number;
};

export type CreditScoreTier = {
  name: string;
  color: string;
  rate: string;
  maxTenure: string;
  minDownPayment: string;
  note: string;
};

export type CreditScoreInputs = {
  values: Record<string, number>;
  monthlyIncome: number;
  obligations: number;
  downPayment: number;
};

export type CreditScoreBreakdown = {
  key: string;
  name: string;
  weight: number;
  score: number;
  points: number;
};

export type CreditScoreSignal = {
  tone: "green" | "yellow" | "red";
  text: string;
};

export const defaultCreditScoreFormula: CreditScoreFormulaConfig = {
  base_score: 500,
  multiplier: 3.2,
  min_score: 500,
  max_score: 910,
};

export const defaultCreditScoreTiers: CreditScoreTierConfig[] = [
  { name: "private_bridge", label: "Private Bridge", min_score: 850, interest_rate: 9, max_tenor_months: 6, min_down_payment: 50 },
  { name: "premium", label: "Premium Tier", min_score: 800, interest_rate: 18, max_tenor_months: 12, min_down_payment: 40 },
  { name: "core", label: "Core Tier", min_score: 700, interest_rate: 22, max_tenor_months: 24, min_down_payment: 30 },
  { name: "access", label: "Access Tier", min_score: 0, interest_rate: 28, max_tenor_months: 48, min_down_payment: 30 },
];

export const creditScoreSelectOptions = {
  employmentType: [
    { label: "Salaried (Govt / Blue-chip)", value: 100 },
    { label: "Salaried (Private)", value: 90 },
    { label: "Self-Employed / Business Owner", value: 75 },
    { label: "Freelancer / Contract", value: 50 },
    { label: "Informal / Undocumented", value: 30 },
  ],
  employmentDuration: [
    { label: "5+ years", value: 100 },
    { label: "3-5 years", value: 85 },
    { label: "1-3 years", value: 65 },
    { label: "6-12 months", value: 40 },
    { label: "< 6 months", value: 15 },
  ],
  incomeSources: [
    { label: "3+ Sources", value: 100 },
    { label: "2 Sources", value: 80 },
    { label: "1 Source", value: 60 },
  ],
  incomeDocumentation: [
    { label: "Bank Statement + Payslip", value: 100 },
    { label: "Bank Statement Only", value: 80 },
    { label: "Self-Declared", value: 55 },
    { label: "None", value: 20 },
  ],
  monthlyCredits: [
    { label: "Very Consistent (<10% variance)", value: 100 },
    { label: "Consistent (10-25%)", value: 80 },
    { label: "Moderate (25-50%)", value: 55 },
    { label: "Irregular (>50%)", value: 25 },
  ],
  overdraftHistory: [
    { label: "Never", value: 100 },
    { label: "Once (last 12mo)", value: 70 },
    { label: "2-3 times", value: 40 },
    { label: "Frequent", value: 10 },
  ],
  savingsBehaviour: [
    { label: "Regular Investor", value: 100 },
    { label: "Regular Saver", value: 85 },
    { label: "Occasional Saver", value: 55 },
    { label: "No Savings Pattern", value: 20 },
  ],
  endOfMonthBalance: [
    { label: "Consistently Positive (>20%)", value: 100 },
    { label: "Positive (5-20%)", value: 80 },
    { label: "Near Zero", value: 50 },
    { label: "Frequently Negative", value: 15 },
  ],
  activeLoanCount: [
    { label: "None", value: 100 },
    { label: "1 Active Loan", value: 85 },
    { label: "2 Active Loans", value: 60 },
    { label: "3+ Active Loans", value: 30 },
  ],
  repaymentHistory: [
    { label: "No defaults ever", value: 100 },
    { label: "1 minor default (>12mo ago)", value: 75 },
    { label: "1-2 defaults (recent)", value: 40 },
    { label: "3+ defaults / current NPL", value: 10 },
    { label: "No credit history", value: 65 },
  ],
  activeBankAccounts: [
    { label: "3+ across banks", value: 100 },
    { label: "2 accounts", value: 80 },
    { label: "1 (Commercial bank)", value: 60 },
    { label: "1 (Microfinance)", value: 35 },
  ],
  transactionFrequency: [
    { label: "Daily", value: 100 },
    { label: "Weekly", value: 80 },
    { label: "Monthly", value: 55 },
    { label: "Infrequent", value: 25 },
  ],
  bankRelationshipAge: [
    { label: "7+ years", value: 100 },
    { label: "3-7 years", value: 85 },
    { label: "1-3 years", value: 65 },
    { label: "< 1 year", value: 35 },
  ],
  internationalTransactions: [
    { label: "Regular (USD/GBP/EUR)", value: 100 },
    { label: "Occasional", value: 75 },
    { label: "None", value: 50 },
  ],
  digitalLendingHistory: [
    { label: "Used & repaid fully (2+)", value: 100 },
    { label: "Used & repaid (1x)", value: 75 },
    { label: "Never used", value: 50 },
    { label: "Defaulted on digital loan", value: 10 },
  ],
  bvnNinStatus: [
    { label: "BVN + NIN Verified", value: 100 },
    { label: "BVN Only", value: 80 },
    { label: "Unverified", value: 40 },
  ],
  investmentActivity: [
    { label: "Active investor", value: 100 },
    { label: "Registered, inactive", value: 65 },
    { label: "None", value: 40 },
  ],
  fintechUsage: [
    { label: "Heavy user", value: 100 },
    { label: "Moderate user", value: 75 },
    { label: "Traditional bank only", value: 40 },
  ],
  downPaymentSource: [
    { label: "Own Savings (Documented)", value: 100 },
    { label: "Investment Liquidation", value: 80 },
    { label: "Business Proceeds", value: 60 },
    { label: "Gift / Family Support", value: 30 },
    { label: "Borrowed", value: 10 },
  ],
  downPaymentReadiness: [
    { label: "Ready Now", value: 100 },
    { label: "Within 2 Weeks", value: 70 },
    { label: "Within 1 Month", value: 40 },
    { label: "> 1 Month", value: 15 },
  ],
};

export const creditScoreSections: CreditScoreSection[] = [
  {
    id: "income_stability",
    title: "Income Stability",
    weight: "25%",
    items: [
      { itemType: 'slider', key: "monthlyIncome", label: "Monthly Net Income (₦)", min: 0, max: 100000000, step: 250000, defaultValue: 0, scoreImpact: 46, minLabel: "₦0", maxLabel: "₦100M+", format: "currency" },
      { itemType: 'field', key: "employmentType", label: "Employment Type", type: 'select', options: creditScoreSelectOptions.employmentType },
      { itemType: 'field', key: "employmentDuration", label: "Employment Duration", type: 'select', options: creditScoreSelectOptions.employmentDuration },
      { itemType: 'field', key: "incomeSources", label: "Number of Income Sources", type: 'select', options: creditScoreSelectOptions.incomeSources },
      { itemType: 'field', key: "incomeDocumentation", label: "Income Documentation", type: 'select', options: creditScoreSelectOptions.incomeDocumentation },
    ],
  },
  {
    id: "cashflow_consistency",
    title: "Cashflow Consistency",
    weight: "20%",
    items: [
      { itemType: 'field', key: "monthlyCredits", label: "Monthly Credits Consistency", type: 'select', options: creditScoreSelectOptions.monthlyCredits },
      { itemType: 'field', key: "overdraftHistory", label: "Account Overdraft History", type: 'select', options: creditScoreSelectOptions.overdraftHistory },
      { itemType: 'field', key: "savingsBehaviour", label: "Savings Behaviour", type: 'select', options: creditScoreSelectOptions.savingsBehaviour },
      { itemType: 'field', key: "endOfMonthBalance", label: "End-of-Month Balance", type: 'select', options: creditScoreSelectOptions.endOfMonthBalance },
    ],
  },
  {
    id: "debt_to_income",
    title: "Debt-to-Income Ratio",
    weight: "20%",
    items: [
      { itemType: 'slider', key: "obligations", label: "Existing Monthly Obligations (₦)", min: 0, max: 5000000, step: 100000, defaultValue: 0, scoreImpact: -34, minLabel: "₦0", maxLabel: "₦5M+", format: "currency" },
      { itemType: 'field', key: "activeLoanCount", label: "Active Loan Count", type: 'select', options: creditScoreSelectOptions.activeLoanCount },
      { itemType: 'field', key: "repaymentHistory", label: "Repayment History", type: 'select', options: creditScoreSelectOptions.repaymentHistory },
    ],
  },
  {
    id: "banking_behaviour",
    title: "Banking Behaviour",
    weight: "15%",
    items: [
      { itemType: 'field', key: "activeBankAccounts", label: "Active Bank Accounts", type: 'select', options: creditScoreSelectOptions.activeBankAccounts },
      { itemType: 'field', key: "transactionFrequency", label: "Transaction Frequency", type: 'select', options: creditScoreSelectOptions.transactionFrequency },
      { itemType: 'field', key: "bankRelationshipAge", label: "Bank Relationship Age", type: 'select', options: creditScoreSelectOptions.bankRelationshipAge },
      { itemType: 'field', key: "internationalTransactions", label: "International Transactions", type: 'select', options: creditScoreSelectOptions.internationalTransactions },
    ],
  },
  {
    id: "digital_footprint",
    title: "Digital Footprint",
    weight: "10%",
    items: [
      { itemType: 'field', key: "digitalLendingHistory", label: "Digital Lending History", type: 'select', options: creditScoreSelectOptions.digitalLendingHistory },
      { itemType: 'field', key: "bvnNinStatus", label: "BVN / NIN Status", type: 'select', options: creditScoreSelectOptions.bvnNinStatus },
      { itemType: 'field', key: "investmentActivity", label: "Investment Platform Activity", type: 'select', options: creditScoreSelectOptions.investmentActivity },
      { itemType: 'field', key: "fintechUsage", label: "Fintech / Mobile Money Usage", type: 'select', options: creditScoreSelectOptions.fintechUsage },
    ],
  },
  {
    id: "down_payment_strength",
    title: "Down Payment Strength",
    weight: "10%",
    items: [
      { itemType: 'slider', key: "downPayment", label: "Down Payment Percentage", min: 0, max: 70, step: 5, defaultValue: 30, scoreImpact: 54, minLabel: "0%", maxLabel: "70%+", format: "percent" },
      { itemType: 'field', key: "downPaymentSource", label: "Source of Down Payment", type: 'select', options: creditScoreSelectOptions.downPaymentSource },
      { itemType: 'field', key: "downPaymentReadiness", label: "Down Payment Readiness", type: 'select', options: creditScoreSelectOptions.downPaymentReadiness },
    ],
  },
];

export const defaultCreditScoreForm: CreditScoreFormConfig = creditScoreSections;

export const creditScoreFieldKeys = creditScoreSections.flatMap((section) =>
  getSectionFields(section).map((field) => field.key)
);

function defaultSliderScoreImpact(key: CreditScoreSliderKey): number {
  if (key === "monthlyIncome") return 46;
  if (key === "downPayment") return 54;
  return -34;
}

function sectionWeightToNumber(weight: string): number {
  const parsed = Number(String(weight).replace("%", ""));
  if (!Number.isFinite(parsed)) return 0;
  return parsed > 1 ? parsed / 100 : parsed;
}

export function getCreditScoreFieldKeys(formConfig: CreditScoreFormConfig = defaultCreditScoreForm): string[] {
  return formConfig.flatMap((section) => getSectionFields(section).map((field) => field.key));
}

export function normalizeCreditScoreFormConfig(value: unknown): CreditScoreFormConfig {
  if (!Array.isArray(value)) return defaultCreditScoreForm;

  const sections = value
    .map((section, sectionIndex) => {
      if (!section || typeof section !== "object") return null;
      const rawSection = section as Record<string, unknown>;
      const title = typeof rawSection.title === "string" && rawSection.title.trim()
        ? rawSection.title.trim()
        : `Section ${sectionIndex + 1}`;
      const id = typeof rawSection.id === "string" && rawSection.id.trim()
        ? rawSection.id.trim()
        : title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || `section_${sectionIndex + 1}`;
      const weight = typeof rawSection.weight === "string" && rawSection.weight.trim()
        ? rawSection.weight.trim()
        : "0%";
      const normalizeSlider = (rawSlider: Record<string, unknown>): ({ itemType: 'slider' } & CreditScoreSliderField) | null => {
        const key = rawSlider.key;
        if (key !== "monthlyIncome" && key !== "obligations" && key !== "downPayment") return null;
        const label = typeof rawSlider.label === "string" && rawSlider.label.trim() ? rawSlider.label.trim() : String(key);
        const min = Number(rawSlider.min);
        const max = Number(rawSlider.max);
        const step = Number(rawSlider.step);
        const defaultValue = Number(rawSlider.defaultValue);
        const scoreImpact = Number(rawSlider.scoreImpact);
        const format = rawSlider.format === "currency" || rawSlider.format === "percent" || rawSlider.format === "number" ? rawSlider.format : "number";
        if (![min, max, step, defaultValue].every(Number.isFinite)) return null;
        return { itemType: 'slider', key, label, min, max, step, defaultValue, scoreImpact: Number.isFinite(scoreImpact) ? scoreImpact : defaultSliderScoreImpact(key), minLabel: typeof rawSlider.minLabel === "string" ? rawSlider.minLabel : String(min), maxLabel: typeof rawSlider.maxLabel === "string" ? rawSlider.maxLabel : String(max), format };
      };
      const normalizeField = (rawField: Record<string, unknown>, fieldIndex: number): ({ itemType: 'field' } & CreditScoreFormField) | null => {
        if (!rawField || typeof rawField !== "object") return null;
        const label = typeof rawField.label === "string" && rawField.label.trim() ? rawField.label.trim() : `Question ${fieldIndex + 1}`;
        const key = typeof rawField.key === "string" && rawField.key.trim() ? rawField.key.trim() : label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || `field_${fieldIndex + 1}`;
        const options = Array.isArray(rawField.options) ? rawField.options.map((option) => {
          if (!option || typeof option !== "object") return null;
          const rawOption = option as Record<string, unknown>;
          const optionLabel = typeof rawOption.label === "string" ? rawOption.label.trim() : "";
          const optionValue = Number(rawOption.value);
          if (!optionLabel || !Number.isFinite(optionValue)) return null;
          return { label: optionLabel, value: optionValue };
        }).filter((o): o is CreditScoreFormOption => Boolean(o)) : [];
        const type = rawField.type === 'radio' ? 'radio' : 'select';
        return { itemType: 'field', key, label, type, options };
      };

      let items: CreditScoreFormItem[];
      if (Array.isArray(rawSection.items)) {
        items = rawSection.items.map((rawItem, idx) => {
          if (!rawItem || typeof rawItem !== "object") return null;
          const raw = rawItem as Record<string, unknown>;
          if (raw.itemType === 'slider') return normalizeSlider(raw);
          return normalizeField(raw, idx);
        }).filter((item): item is CreditScoreFormItem => Boolean(item));
      } else {
        const sliderItems = Array.isArray(rawSection.sliders)
          ? rawSection.sliders.map((s) => s && typeof s === "object" ? normalizeSlider(s as Record<string, unknown>) : null).filter((s): s is ({ itemType: 'slider' } & CreditScoreSliderField) => Boolean(s))
          : (defaultCreditScoreForm.find((sec) => sec.id === id)?.items.filter((i) => i.itemType === 'slider') ?? []) as ({ itemType: 'slider' } & CreditScoreSliderField)[];
        const fieldItems = Array.isArray(rawSection.fields)
          ? rawSection.fields.map((f, fi) => f && typeof f === "object" ? normalizeField(f as Record<string, unknown>, fi) : null).filter((f): f is ({ itemType: 'field' } & CreditScoreFormField) => Boolean(f))
          : [];
        items = [...sliderItems, ...fieldItems];
      }
      return { id, title, weight, items };
    })
    .filter((section): section is CreditScoreFormSection => Boolean(section));

  return sections.length ? sections : defaultCreditScoreForm;
}

export function normalizeCreditScoreFormula(value: unknown): CreditScoreFormulaConfig {
  if (!value || typeof value !== "object") return defaultCreditScoreFormula;
  const raw = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(defaultCreditScoreFormula).map(([key, fallback]) => {
      const current = Number(raw[key]);
      return [key, Number.isFinite(current) ? current : fallback];
    })
  ) as CreditScoreFormulaConfig;
}

export function normalizeCreditScoreTiers(value: unknown): CreditScoreTierConfig[] {
  if (!Array.isArray(value)) return defaultCreditScoreTiers;
  const tiers = value
    .map((tier) => {
      if (!tier || typeof tier !== "object") return null;
      const raw = tier as Record<string, unknown>;
      const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "";
      const label = typeof raw.label === "string" && raw.label.trim() ? raw.label.trim() : name;
      const min_score = Number(raw.min_score);
      const interest_rate = Number(raw.interest_rate);
      const max_tenor_months = Number(raw.max_tenor_months);
      const min_down_payment = Number(raw.min_down_payment);
      if (!name || !label || !Number.isFinite(min_score)) return null;
      return {
        name,
        label,
        min_score,
        interest_rate: Number.isFinite(interest_rate) ? interest_rate : 0,
        max_tenor_months: Number.isFinite(max_tenor_months) ? max_tenor_months : 0,
        min_down_payment: Number.isFinite(min_down_payment) ? min_down_payment : 0,
      };
    })
    .filter((tier): tier is CreditScoreTierConfig => Boolean(tier))
    .sort((a, b) => b.min_score - a.min_score);
  return tiers.length ? tiers : defaultCreditScoreTiers;
}

function tierColor(name: string): string {
  if (name === "private_bridge") return "#9ca3af";
  if (name === "premium") return "#a855f7";
  if (name === "core") return "#38bdf8";
  return "#22c55e";
}

function tierNote(name: string): string {
  if (name === "private_bridge") return "You're in our highest tier - reserved for top-performing financial profiles";
  if (name === "premium") return "You have a strong financial profile with a low risk of default";
  if (name === "core") return "You have a solid credit profile and good repayment history";
  return "You meet our financing criteria and qualify for vehicle credit";
}

export function getCreditScoreTier(score: number, tiers: CreditScoreTierConfig[] = defaultCreditScoreTiers): CreditScoreTier {
  const normalizedTiers = normalizeCreditScoreTiers(tiers);
  const tier = normalizedTiers.find((item) => score >= item.min_score) ?? normalizedTiers[normalizedTiers.length - 1];
  return {
    name: tier.label,
    color: tierColor(tier.name),
    rate: `${tier.interest_rate}%+ p.a.`,
    maxTenure: `${tier.max_tenor_months} month${tier.max_tenor_months === 1 ? "" : "s"}`,
    minDownPayment: `${tier.min_down_payment}%`,
    note: tierNote(tier.name),
  };
}

export function calculateCreditScore({
  values,
  monthlyIncome,
  obligations,
  downPayment,
  formConfig = defaultCreditScoreForm,
  formula = defaultCreditScoreFormula,
}: CreditScoreInputs & { formConfig?: CreditScoreFormConfig; formula?: CreditScoreFormulaConfig }): number {
  const fieldKeys = getCreditScoreFieldKeys(formConfig);
  const selectedAverage = fieldKeys.length
    ? fieldKeys.reduce((sum, key) => sum + (values[key] ?? 0), 0) / fieldKeys.length
    : 0;

  const sliders = formConfig.flatMap((section) => getSectionSliders(section));
  const sliderValues: Record<CreditScoreSliderKey, number> = { monthlyIncome, obligations, downPayment };
  const sliderImpact = sliders.reduce((sum, slider) => {
    const range = slider.max - slider.min;
    if (range <= 0) return sum;
    const value = Math.max(slider.min, Math.min(slider.max, sliderValues[slider.key] ?? slider.defaultValue));
    return sum + ((value - slider.min) / range) * slider.scoreImpact;
  }, 0);
  const raw = formula.base_score + selectedAverage * formula.multiplier + sliderImpact;

  return Math.max(formula.min_score, Math.min(formula.max_score, Math.round(raw)));
}

export function calculateCreditScoreCompletion({
  completedSelects,
  identityComplete,
  formConfig = defaultCreditScoreForm,
}: {
  completedSelects: number;
  identityComplete: boolean;
  formConfig?: CreditScoreFormConfig;
}): number {
  const completedIdentityFields = identityComplete ? 3 : 0;
  const totalFields = getCreditScoreFieldKeys(formConfig).length;
  return Math.round(((completedSelects + completedIdentityFields) / (totalFields + 3)) * 100);
}

function averageSelectedFields(values: Record<string, number>, fieldKeys: string[]): number {
  const selected = fieldKeys.map((key) => values[key]).filter((value) => value !== undefined);
  if (selected.length === 0) return 0;
  return selected.reduce((sum, value) => sum + value, 0) / selected.length;
}

export function getCreditScoreBreakdown(
  values: Record<string, number>,
  formConfig: CreditScoreFormConfig = defaultCreditScoreForm
): CreditScoreBreakdown[] {
  return formConfig.map((section) => {
    const weight = sectionWeightToNumber(section.weight);
    const factorScore = averageSelectedFields(values, getSectionFields(section).map((field) => field.key));
    return {
      key: section.id,
      name: section.title,
      weight,
      score: Math.round(factorScore),
      points: Math.round(factorScore * weight * 6),
    };
  });
}

export function getCreditScoreSignals({
  score,
  monthlyIncome,
  obligations,
  downPayment,
  values,
}: CreditScoreInputs & { score: number }): CreditScoreSignal[] {
  const signals: CreditScoreSignal[] = [];
  const dti = monthlyIncome > 0 ? obligations / monthlyIncome : 0;

  if (values.repaymentHistory === 10) {
    signals.push({ tone: "red", text: "Active default detected - this may affect eligibility" });
  }
  if (dti > 0.5) {
    signals.push({ tone: "red", text: `DTI at ${Math.round(dti * 100)}% exceeds 50% ceiling` });
  }
  if (dti > 0.4 && dti <= 0.5) {
    signals.push({ tone: "yellow", text: "High DTI - likely limits tier placement" });
  }
  if (downPayment < 30) {
    signals.push({ tone: "yellow", text: "Down payment below 30% minimum" });
  }
  if (score >= 800) {
    signals.push({ tone: "green", text: "Strong profile - Premium or Private tier eligible" });
  } else if (score >= 700) {
    signals.push({ tone: "green", text: "Good profile - Core Tier eligible" });
  }
  if (dti > 0 && dti <= 0.2) {
    signals.push({ tone: "green", text: "Excellent debt management" });
  }

  if (signals.length === 0) {
    signals.push({ tone: "green", text: "Your profile looks complete — submit your application to lock in your final rate and terms" });
  }

  return signals.slice(0, 4);
}

export function getApplicationUrl({
  score,
  tier,
  firstName,
  lastName,
  email,
  employmentType,
  monthlyIncome,
  downPayment,
  scoreId,
}: {
  score: number;
  tier: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  employmentType?: string;
  monthlyIncome?: number;
  downPayment?: number;
  scoreId?: string;
}): string {
  const params = new URLSearchParams();

  if (scoreId) {
    params.set("scoreId", scoreId);
  } else {
    params.set("score", String(score));
    params.set("tier", tier);
    if (firstName) params.set("firstName", firstName);
    if (lastName) params.set("lastName", lastName);
    if (email) params.set("email", email);
    if (employmentType) params.set("employmentType", employmentType);
    if (monthlyIncome !== undefined) params.set("monthlyIncome", String(monthlyIncome));
    if (downPayment !== undefined) params.set("downPayment", String(downPayment));
  }

  return `/application?${params.toString()}`;
}
