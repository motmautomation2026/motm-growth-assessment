// Validated sequential blue ramp + fixed status palette (see dataviz skill /
// references/palette.md). Mid-range steps are used so the same hex values
// stay legible on both light and dark card surfaces without a theme switch.

export const CHART_BLUE = "#2a78d6";
export const CHART_BLUE_SOFT = "#86b6ef";

// Ordinal ramp for the 6-stage funnel, light -> dark by volume.
export const FUNNEL_RAMP = ["#86b6ef", "#5598e7", "#3987e5", "#2a78d6", "#256abf", "#1c5cab"] as const;

export const STATUS_COLORS = {
  GREEN: "#0ca30c",
  YELLOW: "#fab219",
  RED: "#d03b3b",
} as const;

export const STATUS_LABELS = {
  GREEN: "Strong",
  YELLOW: "Needs Attention",
  RED: "Critical Gap",
} as const;
