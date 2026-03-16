"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";

/* ───────────────────── Constants ───────────────────── */

const IPHONE_W = 1320;
const IPHONE_H = 2868;

const IPHONE_SIZES = [
  { label: '6.9"', w: 1320, h: 2868 },
  { label: '6.5"', w: 1284, h: 2778 },
  { label: '6.3"', w: 1206, h: 2622 },
  { label: '6.1"', w: 1125, h: 2436 },
] as const;

/* Phone mockup measurements */
const MK_W = 1022;
const MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

/* ───────────────────── Theme ───────────────────── */

const THEMES = {
  "brand-light": {
    bg: "linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 100%)",
    fg: "#0F172A",
    accent: "#2352CC",
    muted: "#64748B",
    labelBg: "rgba(35, 82, 204, 0.08)",
  },
  "brand-dark": {
    bg: "linear-gradient(180deg, #0B1120 0%, #162044 100%)",
    fg: "#F1F5F9",
    accent: "#6B8FFF",
    muted: "#94A3B8",
    labelBg: "rgba(107, 143, 255, 0.12)",
  },
} as const;

type ThemeId = keyof typeof THEMES;

/* ───────────────────── Copy ───────────────────── */

const COPY = {
  slides: [
    {
      label: "SERMONSCRIBE",
      headline: "Capture every\nword spoken.",
      screenshot: "/screenshots/04-notes-list.png",
    },
    {
      label: "LIVE TRANSCRIPTION",
      headline: "See it as\nyou speak.",
      screenshot: "/screenshots/03-transcription.png",
    },
    {
      label: "AI SUMMARIES",
      headline: "Key points,\ninstantly.",
      screenshot: "/screenshots/05-note-detail.png",
    },
    {
      label: "YOUR LIBRARY",
      headline: "Every sermon,\norganized.",
      screenshot: "/screenshots/04-notes-list.png",
    },
    {
      label: "SEARCH",
      headline: "Find any\nmoment.",
      screenshot: "/screenshots/08-search.png",
    },
    {
      label: "SHARE",
      headline: "Export it\nyour way.",
      screenshot: "/screenshots/07-export.png",
    },
    {
      label: "TAGS & FILTERS",
      headline: "Sort by what\nmatters most.",
      screenshot: "/screenshots/09-filters.png",
    },
  ],
};

/* ───────────────────── Components ───────────────────── */

function Phone({
  src,
  alt,
  style,
  className = "",
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: `${MK_W}/${MK_H}`, ...style }}
    >
      <img
        src="/mockup.png"
        alt=""
        className="block w-full h-full"
        draggable={false}
      />
      <div
        className="absolute z-10 overflow-hidden"
        style={{
          left: `${SC_L}%`,
          top: `${SC_T}%`,
          width: `${SC_W}%`,
          height: `${SC_H}%`,
          borderRadius: `${SC_RX}% / ${SC_RY}%`,
        }}
      >
        <img
          src={src}
          alt={alt}
          className="block w-full h-full object-cover object-top"
          draggable={false}
        />
      </div>
    </div>
  );
}

function Caption({
  label,
  headline,
  canvasW,
  theme,
}: {
  label: string;
  headline: string;
  canvasW: number;
  theme: { fg: string; accent: string; muted: string; labelBg: string };
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: canvasW * 0.06,
        left: canvasW * 0.07,
        right: canvasW * 0.07,
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "inline-block",
          fontSize: canvasW * 0.028,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: theme.accent,
          background: theme.labelBg,
          padding: `${canvasW * 0.008}px ${canvasW * 0.018}px`,
          borderRadius: canvasW * 0.012,
          marginBottom: canvasW * 0.02,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: canvasW * 0.092,
          fontWeight: 700,
          lineHeight: 1.0,
          color: theme.fg,
          whiteSpace: "pre-line",
          marginTop: canvasW * 0.015,
        }}
      >
        {headline}
      </div>
    </div>
  );
}

/* Decorative blob */
function Blob({
  x,
  y,
  size,
  color,
  opacity = 0.15,
}: {
  x: string;
  y: string;
  size: number;
  color: string;
  opacity?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        opacity,
        filter: `blur(${size * 0.4}px)`,
        pointerEvents: "none",
      }}
    />
  );
}

/* ───────────────────── Slide Components ───────────────────── */

type ThemeTokens = {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
  labelBg: string;
};

interface SlideProps {
  theme: ThemeTokens;
}

/* Slide 1 — Hero: centered phone, app icon badge */
function Slide1({ theme }: SlideProps) {
  const s = COPY.slides[0];
  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Blob x="-10%" y="-5%" size={600} color={theme.accent} opacity={0.08} />
      <Blob x="70%" y="60%" size={500} color={theme.accent} opacity={0.06} />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={theme}
      />

      {/* App icon badge */}
      <div
        style={{
          position: "absolute",
          top: IPHONE_W * 0.06,
          right: IPHONE_W * 0.07,
          zIndex: 20,
        }}
      >
        <img
          src="/app-icon.png"
          alt="SermonScribe"
          style={{
            width: IPHONE_W * 0.1,
            height: IPHONE_W * 0.1,
            borderRadius: IPHONE_W * 0.022,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
          draggable={false}
        />
      </div>

      {/* Centered phone */}
      <Phone
        src={s.screenshot}
        alt="Notes list"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(12%)",
          width: "84%",
        }}
      />
    </div>
  );
}

/* Slide 2 — Live Transcription: phone slightly left with glow */
function Slide2({ theme }: SlideProps) {
  const s = COPY.slides[1];
  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Blob x="60%" y="30%" size={700} color={theme.accent} opacity={0.07} />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={theme}
      />

      <Phone
        src={s.screenshot}
        alt="Live transcription"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-46%) translateY(10%)",
          width: "82%",
        }}
      />
    </div>
  );
}

/* Slide 3 — AI Summaries: phone right with accent side bar */
function Slide3({ theme }: SlideProps) {
  const s = COPY.slides[2];
  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Accent stripe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: IPHONE_W * 0.012,
          height: "100%",
          background: theme.accent,
          opacity: 0.2,
        }}
      />
      <Blob x="-15%" y="50%" size={500} color={theme.accent} opacity={0.1} />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={theme}
      />

      <Phone
        src={s.screenshot}
        alt="AI summary"
        style={{
          position: "absolute",
          bottom: 0,
          right: "-4%",
          transform: "translateY(14%)",
          width: "82%",
        }}
      />
    </div>
  );
}

/* Slide 4 — Library: two phones stacked */
function Slide4({ theme }: SlideProps) {
  const s = COPY.slides[3];
  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Blob x="50%" y="20%" size={600} color={theme.accent} opacity={0.06} />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={theme}
      />

      {/* Back phone — tags view */}
      <Phone
        src="/screenshots/06-tags.png"
        alt="Tags"
        style={{
          position: "absolute",
          bottom: 0,
          left: "-8%",
          transform: "translateY(18%) rotate(-4deg)",
          width: "65%",
          opacity: 0.5,
        }}
      />

      {/* Front phone — notes list */}
      <Phone
        src={s.screenshot}
        alt="Notes list"
        style={{
          position: "absolute",
          bottom: 0,
          right: "-4%",
          transform: "translateY(10%)",
          width: "82%",
        }}
      />
    </div>
  );
}

/* Slide 5 — Search: centered, clean */
function Slide5({ theme }: SlideProps) {
  const s = COPY.slides[4];
  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Blob x="20%" y="70%" size={400} color={theme.accent} opacity={0.08} />
      <Blob x="80%" y="10%" size={300} color={theme.accent} opacity={0.06} />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={theme}
      />

      <Phone
        src={s.screenshot}
        alt="Search"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(12%)",
          width: "84%",
        }}
      />
    </div>
  );
}

/* Slide 6 — Export/Share: phone left leaning */
function Slide6({ theme }: SlideProps) {
  const s = COPY.slides[5];
  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: theme.bg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Blob x="70%" y="40%" size={500} color={theme.accent} opacity={0.09} />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={theme}
      />

      <Phone
        src={s.screenshot}
        alt="Export"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-54%) translateY(10%) rotate(2deg)",
          width: "82%",
        }}
      />
    </div>
  );
}

/* Slide 7 — Tags & Filters (contrast slide — dark bg for light theme, light for dark) */
function Slide7({ theme }: SlideProps) {
  const s = COPY.slides[6];
  // Use opposite theme for contrast
  const contrastBg =
    theme === THEMES["brand-light"]
      ? THEMES["brand-dark"].bg
      : THEMES["brand-light"].bg;
  const contrastFg =
    theme === THEMES["brand-light"]
      ? THEMES["brand-dark"].fg
      : THEMES["brand-light"].fg;
  const contrastAccent =
    theme === THEMES["brand-light"]
      ? THEMES["brand-dark"].accent
      : THEMES["brand-light"].accent;
  const contrastLabelBg =
    theme === THEMES["brand-light"]
      ? THEMES["brand-dark"].labelBg
      : THEMES["brand-light"].labelBg;

  return (
    <div
      style={{
        width: IPHONE_W,
        height: IPHONE_H,
        position: "relative",
        overflow: "hidden",
        background: contrastBg,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Blob
        x="10%"
        y="80%"
        size={500}
        color={contrastAccent}
        opacity={0.1}
      />

      <Caption
        label={s.label}
        headline={s.headline}
        canvasW={IPHONE_W}
        theme={{
          ...theme,
          fg: contrastFg,
          accent: contrastAccent,
          labelBg: contrastLabelBg,
        }}
      />

      <Phone
        src={s.screenshot}
        alt="Filters"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(14%)",
          width: "86%",
        }}
      />
    </div>
  );
}

/* ───────────────────── Slide Registry ───────────────────── */

const SLIDES = [
  { name: "hero", render: Slide1 },
  { name: "transcription", render: Slide2 },
  { name: "summaries", render: Slide3 },
  { name: "library", render: Slide4 },
  { name: "search", render: Slide5 },
  { name: "export", render: Slide6 },
  { name: "filters", render: Slide7 },
];

/* ───────────────────── Preview Card ───────────────────── */

function ScreenshotPreview({
  slideIndex,
  slideName,
  SlideComponent,
  theme,
  onExport,
}: {
  slideIndex: number;
  slideName: string;
  SlideComponent: React.FC<SlideProps>;
  theme: ThemeTokens;
  onExport: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setScale(width / IPHONE_W);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer"
      style={{
        aspectRatio: `${IPHONE_W}/${IPHONE_H}`,
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onExport(slideIndex)}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: IPHONE_W,
          height: IPHONE_H,
        }}
      >
        <SlideComponent theme={theme} />
      </div>

      {/* Hover overlay */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              padding: "8px 16px",
              background: "rgba(35,82,204,0.9)",
              borderRadius: 8,
            }}
          >
            Export
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
            {String(slideIndex + 1).padStart(2, "0")}-{slideName}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────── Main Page ───────────────────── */

export default function ScreenshotsPage() {
  const [themeId, setThemeId] = useState<ThemeId>("brand-light");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const offscreenRefs = useRef<(HTMLDivElement | null)[]>([]);

  const theme = THEMES[themeId];
  const size = IPHONE_SIZES[sizeIdx];

  const exportSlide = useCallback(
    async (index: number) => {
      const el = offscreenRefs.current[index];
      if (!el) return;

      setExporting(true);

      // Move on-screen for capture
      el.style.left = "0px";
      el.style.opacity = "1";
      el.style.zIndex = "-1";

      const opts = {
        width: size.w,
        height: size.h,
        pixelRatio: 1,
        cacheBust: true,
      };

      try {
        // Double-call trick
        await toPng(el, opts);
        const dataUrl = await toPng(el, opts);

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${String(index + 1).padStart(2, "0")}-${SLIDES[index].name}-${size.w}x${size.h}.png`;
        link.click();
      } finally {
        el.style.left = "-9999px";
        el.style.opacity = "";
        el.style.zIndex = "";
        setExporting(false);
      }
    },
    [size],
  );

  const exportAll = useCallback(async () => {
    setExportingAll(true);
    for (let i = 0; i < SLIDES.length; i++) {
      await exportSlide(i);
      // 300ms delay between exports
      await new Promise((r) => setTimeout(r, 300));
    }
    setExportingAll(false);
  }, [exportSlide]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f5f5f5",
        padding: 32,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 8,
        }}
      >
        <img
          src="/app-icon.png"
          alt="SermonScribe"
          style={{ width: 48, height: 48, borderRadius: 10 }}
        />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            SermonScribe App Store Screenshots
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#888",
              margin: 0,
              marginTop: 2,
            }}
          >
            {SLIDES.length} screenshots · {size.w}x{size.h}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Size dropdown */}
        <select
          value={sizeIdx}
          onChange={(e) => setSizeIdx(Number(e.target.value))}
          style={{
            background: "#1a1a1a",
            color: "#f5f5f5",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 14,
          }}
        >
          {IPHONE_SIZES.map((s, i) => (
            <option key={i} value={i}>
              {s.label} ({s.w}×{s.h})
            </option>
          ))}
        </select>

        {/* Theme toggle */}
        {(Object.keys(THEMES) as ThemeId[]).map((id) => (
          <button
            key={id}
            onClick={() => setThemeId(id)}
            style={{
              background: themeId === id ? "#2352CC" : "#1a1a1a",
              color: themeId === id ? "#fff" : "#999",
              border: `1px solid ${themeId === id ? "#2352CC" : "#333"}`,
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 14,
              fontWeight: themeId === id ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {id.replace("-", " ")}
          </button>
        ))}

        {/* Export All */}
        <button
          onClick={exportAll}
          disabled={exporting || exportingAll}
          style={{
            marginLeft: "auto",
            background: exportingAll ? "#333" : "#2352CC",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: exportingAll ? "not-allowed" : "pointer",
          }}
        >
          {exportingAll ? "Exporting..." : "Export All"}
        </button>
      </div>

      {/* Preview Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {SLIDES.map((slide, i) => (
          <ScreenshotPreview
            key={`${slide.name}-${themeId}`}
            slideIndex={i}
            slideName={slide.name}
            SlideComponent={slide.render}
            theme={theme}
            onExport={exportSlide}
          />
        ))}
      </div>

      {/* Offscreen export containers */}
      {SLIDES.map((slide, i) => (
        <div
          key={`offscreen-${slide.name}-${themeId}`}
          ref={(el) => {
            offscreenRefs.current[i] = el;
          }}
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: size.w,
            height: size.h,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <div
            style={{
              transform: `scale(${size.w / IPHONE_W})`,
              transformOrigin: "top left",
              width: IPHONE_W,
              height: IPHONE_H,
            }}
          >
            <slide.render theme={theme} />
          </div>
        </div>
      ))}

      {exporting && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 12,
            padding: "12px 20px",
            fontSize: 14,
            color: "#ccc",
          }}
        >
          Exporting screenshot...
        </div>
      )}
    </div>
  );
}
