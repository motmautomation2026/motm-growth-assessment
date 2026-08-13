export const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  INR: "INR (₹) — Indian Rupee",
  USD: "USD ($) — US Dollar",
  EUR: "EUR (€) — Euro",
  GBP: "GBP (£) — British Pound",
  AED: "AED (د.إ) — UAE Dirham",
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
};

const LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  AED: "ar-AE",
};

export function formatCurrency(amount: number, currency: CurrencyCode = "INR"): string {
  return amount.toLocaleString(LOCALE_BY_CURRENCY[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
}

// Heuristic constants used by the "estimate" calculators (lead gen budget, regional
// expansion, in-house team cost). These are directional placeholders, not real MOTM
// pricing data — kept per-currency so the estimate at least stays in the right order
// of magnitude regardless of which currency the user selects.
export const HEURISTIC_CONSTANTS: Record<
  CurrencyCode,
  { founderHourlyValue: number; outreachUnitCost: number; assumedManagerMonthlySalary: number }
> = {
  INR: { founderHourlyValue: 1500, outreachUnitCost: 500, assumedManagerMonthlySalary: 150000 },
  USD: { founderHourlyValue: 100, outreachUnitCost: 8, assumedManagerMonthlySalary: 3000 },
  EUR: { founderHourlyValue: 90, outreachUnitCost: 7, assumedManagerMonthlySalary: 2800 },
  GBP: { founderHourlyValue: 80, outreachUnitCost: 6, assumedManagerMonthlySalary: 2500 },
  AED: { founderHourlyValue: 370, outreachUnitCost: 30, assumedManagerMonthlySalary: 11000 },
};
