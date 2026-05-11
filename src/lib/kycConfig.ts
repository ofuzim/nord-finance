export type KycRequirement = {
  required: boolean;
  order: number;
};

export type KycConfig = Record<string, KycRequirement>;

export const kycFieldGroups = [
  {
    title: "Identity",
    items: [
      ["title", "Title"],
      ["firstName", "First Name"],
      ["lastName", "Last Name"],
      ["otherNames", "Other Names"],
      ["gender", "Gender"],
      ["dateOfBirth", "Date of Birth"],
      ["maritalStatus", "Marital Status"],
      ["numChildren", "Number of Children"],
      ["stateOfOrigin", "State of Origin"],
      ["lgaOfOrigin", "LGA of Origin"],
    ],
  },
  {
    title: "Contact Details",
    items: [
      ["phoneNumber", "Phone Number"],
      ["emailAddress", "Email Address"],
      ["homeAddress", "Home Address"],
      ["landmark", "Landmark / Nearest Bus Stop"],
      ["stateOfResidence", "State of Residence"],
      ["lgaOfResidence", "LGA of Residence"],
      ["residentialStatus", "Residential Status"],
    ],
  },
  {
    title: "Employment & Business",
    items: [
      ["occupation", "Occupation"],
      ["employerName", "Employer / Business Name"],
      ["officeAddress", "Office / Business Address"],
      ["employmentType", "Employment Type"],
    ],
  },
  {
    title: "Government ID",
    items: [
      ["idType", "ID Type"],
      ["idNumber", "ID Card Number"],
      ["idExpiry", "ID Expiry Date"],
      ["nin", "NIN"],
      ["bvn", "BVN"],
    ],
  },
  {
    title: "Supporting Documents",
    items: [
      ["governmentId", "Government Issued ID"],
      ["passport", "Passport Photograph"],
      ["bankStatement", "Bank Statement"],
      ["payslip", "Payslip"],
      ["residence", "Proof of Residence"],
    ],
  },
] as const;

export const defaultKycConfig: KycConfig = Object.fromEntries(
  kycFieldGroups.flatMap((group) =>
    group.items.map(([key], index) => [
      key,
      {
        required: [
          "title",
          "firstName",
          "lastName",
          "gender",
          "dateOfBirth",
          "maritalStatus",
          "stateOfOrigin",
          "lgaOfOrigin",
          "phoneNumber",
          "emailAddress",
          "homeAddress",
          "stateOfResidence",
          "lgaOfResidence",
          "residentialStatus",
          "occupation",
          "employmentType",
          "idType",
          "idNumber",
          "nin",
          "bvn",
        ].includes(key),
        order: index,
      },
    ])
  )
);

export type KycFieldGroup = typeof kycFieldGroups[number];
export type KycFieldItem = KycFieldGroup["items"][number];

export function normalizeKycConfig(value: unknown): KycConfig {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(
    Object.entries(defaultKycConfig).map(([key, fallback]) => {
      const item = raw[key];
      const required = item && typeof item === "object" && "required" in item
        ? Boolean((item as Record<string, unknown>).required)
        : fallback.required;
      const rawOrder = item && typeof item === "object" && "order" in item
        ? Number((item as Record<string, unknown>).order)
        : fallback.order;
      return [key, { required, order: Number.isFinite(rawOrder) ? rawOrder : fallback.order }];
    })
  );
}

export function isKycRequired(config: KycConfig, key: string): boolean {
  return config[key]?.required ?? defaultKycConfig[key]?.required ?? false;
}

export function getKycGroupItems(group: KycFieldGroup, config: KycConfig): KycFieldItem[] {
  return [...group.items].sort(([keyA], [keyB]) => {
    const orderA = config[keyA]?.order ?? defaultKycConfig[keyA]?.order ?? 0;
    const orderB = config[keyB]?.order ?? defaultKycConfig[keyB]?.order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return group.items.findIndex(([key]) => key === keyA) - group.items.findIndex(([key]) => key === keyB);
  });
}
