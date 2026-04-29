/** Shared with application form and loan calculator — keep in sync with product lineup. */

export type VehicleGroup = {
  category: string;
  site: string;
  models: string[];
};

export const vehicleGroups: VehicleGroup[] = [
  {
    category: "Sedans",
    site: "https://www.nordmotion.com",
    models: ["Nord A3", "Nord C3"],
  },
  {
    category: "SUVs",
    site: "https://www.nordmotion.com",
    models: ["Nord A5", "Nord A7", "Nord C9", "Nord A9", "Nord Demir"],
  },
  {
    category: "Pickup Trucks",
    site: "https://www.nordmotion.com",
    models: ["Nord Max", "Nord Tusk"],
  },
  {
    category: "Buses",
    site: "https://www.nordmotion.com",
    models: ["Nord Flit", "Nord Tripper", "Nord CICA"],
  },
  {
    category: "Tavet Models",
    site: "https://www.tavetmotion.com",
    models: ["Tavet Luto", "Tavet Garent", "Tavet Vant"],
  },
];

/** Indicative vehicle prices (NGN) for calculator estimates only. */
export const MODEL_INDICATIVE_PRICES: Record<string, number> = {
  "Nord A3": 30_000_000,
  "Nord C3": 32_000_000,
  "Nord A5": 32_500_000,
  "Nord A7": 35_000_000,
  "Nord C9": 36_000_000,
  "Nord A9": 42_000_000,
  "Nord Demir": 40_000_000,
  "Nord Max": 38_000_000,
  "Nord Tusk": 37_000_000,
  "Nord Flit": 45_000_000,
  "Nord Tripper": 48_000_000,
  "Nord CICA": 55_000_000,
  "Tavet Luto": 34_000_000,
  "Tavet Garent": 41_000_000,
  "Tavet Vant": 39_000_000,
};

export function indicativePriceForModel(model: string): number {
  return MODEL_INDICATIVE_PRICES[model] ?? 35_000_000;
}
