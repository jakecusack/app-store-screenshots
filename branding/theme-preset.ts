/**
 * Brand theme preset derived from app logo.
 *
 * Primary: #2352CC (royal blue)
 * Background gradient: #EEF2FF → #FFFFFF (light blue-white)
 *
 * Drop this file into your generated Next.js project's src/ directory
 * and import the tokens into page.tsx to wire up the theme system.
 */

export const BRAND_COLORS = {
  primary: "#2352CC",
  backgroundStart: "#EEF2FF",
  backgroundEnd: "#FFFFFF",
} as const;

export const THEMES = {
  "brand-light": {
    bg: `linear-gradient(180deg, ${BRAND_COLORS.backgroundStart} 0%, ${BRAND_COLORS.backgroundEnd} 100%)`,
    bgFlat: BRAND_COLORS.backgroundStart,
    fg: "#0F172A",
    accent: BRAND_COLORS.primary,
    muted: "#64748B",
  },
  "brand-dark": {
    bg: "linear-gradient(180deg, #0B1120 0%, #162044 100%)",
    bgFlat: "#0B1120",
    fg: "#F1F5F9",
    accent: "#6B8FFF",
    muted: "#94A3B8",
  },
} as const;

export type ThemeId = keyof typeof THEMES;
