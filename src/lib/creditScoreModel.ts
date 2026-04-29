export type CreditScoreOption = {
  label: string;
  value: number;
};

export type CreditScoreSelectField = {
  key: string;
  label: string;
  options: CreditScoreOption[];
};

export type CreditScoreSection = {
  title: string;
  weight: string;
  fields: CreditScoreSelectField[];
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

const factorDefinitions = [
  {
    key: "income",
    name: "Income Stability",
    weight: 0.25,
    fieldKeys: ["employmentType", "employmentDuration", "incomeSources", "incomeDocumentation"],
  },
  {
    key: "cashflow",
    name: "Cashflow",
    weight: 0.2,
    fieldKeys: ["monthlyCredits", "overdraftHistory", "savingsBehaviour", "endOfMonthBalance"],
  },
  {
    key: "dti",
    name: "Debt / Income",
    weight: 0.2,
    fieldKeys: ["activeLoanCount", "repaymentHistory"],
  },
  {
    key: "banking",
    name: "Banking",
    weight: 0.15,
    fieldKeys: ["activeBankAccounts", "transactionFrequency", "bankRelationshipAge", "internationalTransactions"],
  },
  {
    key: "digital",
    name: "Digital",
    weight: 0.1,
    fieldKeys: ["digitalLendingHistory", "bvnNinStatus", "investmentActivity", "fintechUsage"],
  },
  {
    key: "downpay",
    name: "Down Payment",
    weight: 0.1,
    fieldKeys: ["downPaymentSource", "downPaymentReadiness"],
  },
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
    { label: "1 (Tier 1 bank)", value: 60 },
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
    title: "Income Stability",
    weight: "25%",
    fields: [
      { key: "employmentType", label: "Employment Type", options: creditScoreSelectOptions.employmentType },
      { key: "employmentDuration", label: "Employment Duration", options: creditScoreSelectOptions.employmentDuration },
      { key: "incomeSources", label: "Number of Income Sources", options: creditScoreSelectOptions.incomeSources },
      { key: "incomeDocumentation", label: "Income Documentation", options: creditScoreSelectOptions.incomeDocumentation },
    ],
  },
  {
    title: "Cashflow Consistency",
    weight: "20%",
    fields: [
      { key: "monthlyCredits", label: "Monthly Credits Consistency", options: creditScoreSelectOptions.monthlyCredits },
      { key: "overdraftHistory", label: "Account Overdraft History", options: creditScoreSelectOptions.overdraftHistory },
      { key: "savingsBehaviour", label: "Savings Behaviour", options: creditScoreSelectOptions.savingsBehaviour },
      { key: "endOfMonthBalance", label: "End-of-Month Balance", options: creditScoreSelectOptions.endOfMonthBalance },
    ],
  },
  {
    title: "Debt-to-Income Ratio",
    weight: "20%",
    fields: [
      { key: "activeLoanCount", label: "Active Loan Count", options: creditScoreSelectOptions.activeLoanCount },
      { key: "repaymentHistory", label: "Repayment History", options: creditScoreSelectOptions.repaymentHistory },
    ],
  },
  {
    title: "Banking Behaviour",
    weight: "15%",
    fields: [
      { key: "activeBankAccounts", label: "Active Bank Accounts", options: creditScoreSelectOptions.activeBankAccounts },
      { key: "transactionFrequency", label: "Transaction Frequency", options: creditScoreSelectOptions.transactionFrequency },
      { key: "bankRelationshipAge", label: "Bank Relationship Age", options: creditScoreSelectOptions.bankRelationshipAge },
      { key: "internationalTransactions", label: "International Transactions", options: creditScoreSelectOptions.internationalTransactions },
    ],
  },
  {
    title: "Digital Footprint",
    weight: "10%",
    fields: [
      { key: "digitalLendingHistory", label: "Digital Lending History", options: creditScoreSelectOptions.digitalLendingHistory },
      { key: "bvnNinStatus", label: "BVN / NIN Status", options: creditScoreSelectOptions.bvnNinStatus },
      { key: "investmentActivity", label: "Investment Platform Activity", options: creditScoreSelectOptions.investmentActivity },
      { key: "fintechUsage", label: "Fintech / Mobile Money Usage", options: creditScoreSelectOptions.fintechUsage },
    ],
  },
  {
    title: "Down Payment Strength",
    weight: "10%",
    fields: [
      { key: "downPaymentSource", label: "Source of Down Payment", options: creditScoreSelectOptions.downPaymentSource },
      { key: "downPaymentReadiness", label: "Down Payment Readiness", options: creditScoreSelectOptions.downPaymentReadiness },
    ],
  },
];

export const creditScoreFieldKeys = creditScoreSections.flatMap((section) =>
  section.fields.map((field) => field.key)
);

export function getCreditScoreTier(score: number): CreditScoreTier {
  if (score >= 850) {
    return { name: "Private Bridge", color: "#EDD98A", rate: "from 9% p.a.", maxTenure: "6 months", minDownPayment: "50%", note: "Highest confidence profile" };
  }
  if (score >= 800) {
    return { name: "Premium Tier", color: "#D4A535", rate: "18% p.a. avg.", maxTenure: "18 months", minDownPayment: "30%", note: "Priority access profile" };
  }
  if (score >= 700) {
    return { name: "Core Tier", color: "#C39529", rate: "22% p.a.", maxTenure: "36 months", minDownPayment: "30%", note: "Balanced credit profile" };
  }
  return { name: "Access Tier", color: "#8B6914", rate: "28%+ p.a.", maxTenure: "48 months", minDownPayment: "30%", note: "Entry access profile" };
}

export function calculateCreditScore({
  values,
  monthlyIncome,
  obligations,
  downPayment,
}: CreditScoreInputs): number {
  const selectedAverage =
    creditScoreFieldKeys.reduce((sum, key) => sum + (values[key] ?? 0), 0) / creditScoreFieldKeys.length;

  const incomeBoost = Math.min(monthlyIncome / 10000000, 1) * 46;
  const obligationPenalty = Math.min(obligations / 5000000, 1) * 34;
  const downPaymentBoost = Math.min(downPayment / 70, 1) * 54;
  const raw = 520 + selectedAverage * 3.2 + incomeBoost + downPaymentBoost - obligationPenalty;

  return Math.max(520, Math.min(910, Math.round(raw)));
}

export function calculateCreditScoreCompletion({
  completedSelects,
  identityComplete,
}: {
  completedSelects: number;
  identityComplete: boolean;
}): number {
  const completedIdentityFields = identityComplete ? 3 : 0;
  return Math.round(((completedSelects + completedIdentityFields) / (creditScoreFieldKeys.length + 3)) * 100);
}

function averageSelectedFields(values: Record<string, number>, fieldKeys: string[]): number {
  const selected = fieldKeys.map((key) => values[key]).filter((value) => value !== undefined);
  if (selected.length === 0) return 0;
  return selected.reduce((sum, value) => sum + value, 0) / selected.length;
}

export function getCreditScoreBreakdown(values: Record<string, number>): CreditScoreBreakdown[] {
  return factorDefinitions.map((factor) => {
    const factorScore = averageSelectedFields(values, factor.fieldKeys);
    return {
      key: factor.key,
      name: factor.name,
      weight: factor.weight,
      score: Math.round(factorScore),
      points: Math.round(factorScore * factor.weight * 6),
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
    signals.push({ tone: "green", text: "Indicative profile generated - complete KYC to verify terms" });
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
}: {
  score: number;
  tier: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  employmentType?: string;
  monthlyIncome?: number;
  downPayment?: number;
}): string {
  const params = new URLSearchParams({
    score: String(score),
    tier,
  });

  if (firstName) params.set("firstName", firstName);
  if (lastName) params.set("lastName", lastName);
  if (email) params.set("email", email);
  if (employmentType) params.set("employmentType", employmentType);
  if (monthlyIncome !== undefined) params.set("monthlyIncome", String(monthlyIncome));
  if (downPayment !== undefined) params.set("downPayment", String(downPayment));

  return `/application?${params.toString()}`;
}
