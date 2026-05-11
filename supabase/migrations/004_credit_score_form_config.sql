insert into credit_score_config (config_key, config_value, description)
values (
  'credit_score_form',
  '[
    {
      "id": "income_stability",
      "title": "Income Stability",
      "weight": "25%",
      "sliders": [
        {"key": "monthlyIncome", "label": "Monthly Net Income (₦)", "min": 0, "max": 100000000, "step": 250000, "defaultValue": 0, "minLabel": "₦0", "maxLabel": "₦100M+", "format": "currency"}
      ],
      "fields": [
        {"key": "employmentType", "label": "Employment Type", "options": [{"label": "Salaried (Govt / Blue-chip)", "value": 100}, {"label": "Salaried (Private)", "value": 90}, {"label": "Self-Employed / Business Owner", "value": 75}, {"label": "Freelancer / Contract", "value": 50}, {"label": "Informal / Undocumented", "value": 30}]},
        {"key": "employmentDuration", "label": "Employment Duration", "options": [{"label": "5+ years", "value": 100}, {"label": "3-5 years", "value": 85}, {"label": "1-3 years", "value": 65}, {"label": "6-12 months", "value": 40}, {"label": "< 6 months", "value": 15}]},
        {"key": "incomeSources", "label": "Number of Income Sources", "options": [{"label": "3+ Sources", "value": 100}, {"label": "2 Sources", "value": 80}, {"label": "1 Source", "value": 60}]},
        {"key": "incomeDocumentation", "label": "Income Documentation", "options": [{"label": "Bank Statement + Payslip", "value": 100}, {"label": "Bank Statement Only", "value": 80}, {"label": "Self-Declared", "value": 55}, {"label": "None", "value": 20}]}
      ]
    },
    {
      "id": "cashflow_consistency",
      "title": "Cashflow Consistency",
      "weight": "20%",
      "fields": [
        {"key": "monthlyCredits", "label": "Monthly Credits Consistency", "options": [{"label": "Very Consistent (<10% variance)", "value": 100}, {"label": "Consistent (10-25%)", "value": 80}, {"label": "Moderate (25-50%)", "value": 55}, {"label": "Irregular (>50%)", "value": 25}]},
        {"key": "overdraftHistory", "label": "Account Overdraft History", "options": [{"label": "Never", "value": 100}, {"label": "Once (last 12mo)", "value": 70}, {"label": "2-3 times", "value": 40}, {"label": "Frequent", "value": 10}]},
        {"key": "savingsBehaviour", "label": "Savings Behaviour", "options": [{"label": "Regular Investor", "value": 100}, {"label": "Regular Saver", "value": 85}, {"label": "Occasional Saver", "value": 55}, {"label": "No Savings Pattern", "value": 20}]},
        {"key": "endOfMonthBalance", "label": "End-of-Month Balance", "options": [{"label": "Consistently Positive (>20%)", "value": 100}, {"label": "Positive (5-20%)", "value": 80}, {"label": "Near Zero", "value": 50}, {"label": "Frequently Negative", "value": 15}]}
      ]
    },
    {
      "id": "debt_to_income",
      "title": "Debt-to-Income Ratio",
      "weight": "20%",
      "sliders": [
        {"key": "obligations", "label": "Existing Monthly Obligations (₦)", "min": 0, "max": 5000000, "step": 100000, "defaultValue": 0, "minLabel": "₦0", "maxLabel": "₦5M+", "format": "currency"}
      ],
      "fields": [
        {"key": "activeLoanCount", "label": "Active Loan Count", "options": [{"label": "None", "value": 100}, {"label": "1 Active Loan", "value": 85}, {"label": "2 Active Loans", "value": 60}, {"label": "3+ Active Loans", "value": 30}]},
        {"key": "repaymentHistory", "label": "Repayment History", "options": [{"label": "No defaults ever", "value": 100}, {"label": "1 minor default (>12mo ago)", "value": 75}, {"label": "1-2 defaults (recent)", "value": 40}, {"label": "3+ defaults / current NPL", "value": 10}, {"label": "No credit history", "value": 65}]}
      ]
    },
    {
      "id": "banking_behaviour",
      "title": "Banking Behaviour",
      "weight": "15%",
      "fields": [
        {"key": "activeBankAccounts", "label": "Active Bank Accounts", "options": [{"label": "3+ across banks", "value": 100}, {"label": "2 accounts", "value": 80}, {"label": "1 (Commercial bank)", "value": 60}, {"label": "1 (Microfinance)", "value": 35}]},
        {"key": "transactionFrequency", "label": "Transaction Frequency", "options": [{"label": "Daily", "value": 100}, {"label": "Weekly", "value": 80}, {"label": "Monthly", "value": 55}, {"label": "Infrequent", "value": 25}]},
        {"key": "bankRelationshipAge", "label": "Bank Relationship Age", "options": [{"label": "7+ years", "value": 100}, {"label": "3-7 years", "value": 85}, {"label": "1-3 years", "value": 65}, {"label": "< 1 year", "value": 35}]},
        {"key": "internationalTransactions", "label": "International Transactions", "options": [{"label": "Regular (USD/GBP/EUR)", "value": 100}, {"label": "Occasional", "value": 75}, {"label": "None", "value": 50}]}
      ]
    },
    {
      "id": "digital_footprint",
      "title": "Digital Footprint",
      "weight": "10%",
      "fields": [
        {"key": "digitalLendingHistory", "label": "Digital Lending History", "options": [{"label": "Used & repaid fully (2+)", "value": 100}, {"label": "Used & repaid (1x)", "value": 75}, {"label": "Never used", "value": 50}, {"label": "Defaulted on digital loan", "value": 10}]},
        {"key": "bvnNinStatus", "label": "BVN / NIN Status", "options": [{"label": "BVN + NIN Verified", "value": 100}, {"label": "BVN Only", "value": 80}, {"label": "Unverified", "value": 40}]},
        {"key": "investmentActivity", "label": "Investment Platform Activity", "options": [{"label": "Active investor", "value": 100}, {"label": "Registered, inactive", "value": 65}, {"label": "None", "value": 40}]},
        {"key": "fintechUsage", "label": "Fintech / Mobile Money Usage", "options": [{"label": "Heavy user", "value": 100}, {"label": "Moderate user", "value": 75}, {"label": "Traditional bank only", "value": 40}]}
      ]
    },
    {
      "id": "down_payment_strength",
      "title": "Down Payment Strength",
      "weight": "10%",
      "sliders": [
        {"key": "downPayment", "label": "Down Payment Percentage", "min": 0, "max": 70, "step": 5, "defaultValue": 30, "minLabel": "0%", "maxLabel": "70%+", "format": "percent"}
      ],
      "fields": [
        {"key": "downPaymentSource", "label": "Source of Down Payment", "options": [{"label": "Own Savings (Documented)", "value": 100}, {"label": "Investment Liquidation", "value": 80}, {"label": "Business Proceeds", "value": 60}, {"label": "Gift / Family Support", "value": 30}, {"label": "Borrowed", "value": 10}]},
        {"key": "downPaymentReadiness", "label": "Down Payment Readiness", "options": [{"label": "Ready Now", "value": 100}, {"label": "Within 2 Weeks", "value": 70}, {"label": "Within 1 Month", "value": 40}, {"label": "> 1 Month", "value": 15}]}
      ]
    }
  ]',
  'Editable credit score questionnaire sections, questions, answer labels, and saved numeric values'
)
on conflict (config_key) do nothing;
