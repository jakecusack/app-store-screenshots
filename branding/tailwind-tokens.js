/**
 * Tailwind CSS theme extension for brand colors.
 *
 * Usage in tailwind.config.ts:
 *   const brandTokens = require("./branding/tailwind-tokens");
 *   module.exports = { theme: { extend: brandTokens } };
 */

module.exports = {
  colors: {
    brand: {
      DEFAULT: "#2352CC",
      hover: "#1B43A8",
      light: "#6B8FFF",
      bg: "#EEF2FF",
      fg: "#0F172A",
      muted: "#64748B",
    },
    "brand-dark": {
      bg: "#0B1120",
      "bg-end": "#162044",
      fg: "#F1F5F9",
      accent: "#6B8FFF",
      muted: "#94A3B8",
    },
  },
};
