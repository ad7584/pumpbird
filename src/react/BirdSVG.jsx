// ============================================================
// BirdSVG — the cartoon bird mascot, shared by LandingPage and GameHome.
// Detailed cartoon style: hair tuft, sparkly eye, eyebrow, tail feathers,
// three-feather wing, two-toned beak, drop shadow.
// ============================================================
export default function BirdSVG({ className = '' }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden>
      {/* Ground drop shadow */}
      <ellipse cx="130" cy="232" rx="72" ry="9" fill="rgba(0,0,0,0.22)" />

      {/* ===== TAIL FEATHERS ===== */}
      {/* Three feather tips behind the body, layered */}
      <g>
        <path
          d="M62 132 q-26 -6 -34 8 q-3 18 18 22 q14 2 24 -8 z"
          fill="#FFB300" stroke="#0E0A1F" strokeWidth="5" strokeLinejoin="round"
        />
        <path
          d="M58 156 q-30 4 -34 22 q4 16 24 14 q14 -2 22 -14 z"
          fill="#FFD63A" stroke="#0E0A1F" strokeWidth="5" strokeLinejoin="round"
        />
        <path
          d="M64 178 q-26 12 -22 30 q12 12 28 4 q10 -6 14 -18 z"
          fill="#FFB300" stroke="#0E0A1F" strokeWidth="5" strokeLinejoin="round"
        />
      </g>

      {/* ===== BODY ===== */}
      <circle cx="130" cy="130" r="82" fill="#FFD63A" stroke="#0E0A1F" strokeWidth="6" />
      {/* Belly */}
      <ellipse cx="130" cy="160" rx="50" ry="36" fill="#FFE989" />
      {/* Subtle body highlight (top-left) */}
      <ellipse cx="100" cy="92" rx="22" ry="14" fill="#FFF3B8" opacity="0.7" />

      {/* ===== HAIR TUFT (top of head) ===== */}
      {/* A little curly feather sticking up — adds personality */}
      <path
        d="M128 48 q -8 -14 4 -22 q 14 -2 12 14 q -2 8 -16 8 z"
        fill="#FF7A00" stroke="#0E0A1F" strokeWidth="5" strokeLinejoin="round"
      />
      <path
        d="M138 28 q 4 -4 8 -2"
        stroke="#0E0A1F" strokeWidth="3" fill="none" strokeLinecap="round"
      />

      {/* ===== WING ===== */}
      {/* Wing has three feather tips for detail */}
      <g>
        {/* Wing base outline */}
        <path
          d="M92 122
             q-26 8 -28 36
             q4 16 22 16
             q22 0 42 -16
             q8 -8 4 -18
             q-6 -18 -40 -18 z"
          fill="#FFB300" stroke="#0E0A1F" strokeWidth="6" strokeLinejoin="round"
        />
        {/* Inner darker accent on wing */}
        <path
          d="M104 144 q-12 4 -14 18 q4 8 14 6"
          stroke="#E59800" strokeWidth="3" fill="none" strokeLinecap="round"
        />
        {/* Three feather-tip dividers */}
        <path d="M96 162 l-4 12" stroke="#0E0A1F" strokeWidth="3" strokeLinecap="round" />
        <path d="M112 168 l-2 14" stroke="#0E0A1F" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 168 l 0 12" stroke="#0E0A1F" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ===== EYEBROW ===== */}
      {/* Adds expression — slightly raised for "alert" look */}
      <path
        d="M148 72 q 12 -6 26 0"
        stroke="#0E0A1F" strokeWidth="6" strokeLinecap="round" fill="none"
      />

      {/* ===== EYE ===== */}
      {/* Outline */}
      <circle cx="160" cy="98" r="26" fill="#0E0A1F" />
      {/* White */}
      <circle cx="160" cy="98" r="22" fill="#FFFFFF" />
      {/* Iris */}
      <circle cx="165" cy="100" r="14" fill="#0E0A1F" />
      {/* Inner sparkle highlights */}
      <circle cx="170" cy="95"  r="5"  fill="#FFFFFF" />
      <circle cx="160" cy="106" r="2.5" fill="#FFFFFF" />
      {/* Tiny lower-lid line */}
      <path
        d="M142 108 q 18 8 36 0"
        stroke="#0E0A1F" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"
      />

      {/* ===== CHEEK BLUSH ===== */}
      <ellipse cx="170" cy="140" rx="14" ry="10" fill="#FF8FBE" opacity="0.85" />
      <ellipse cx="167" cy="138" rx="4" ry="3" fill="#FFB3CD" opacity="0.9" />

      {/* ===== BEAK ===== */}
      {/* Two-toned: orange top, darker bottom, with a tiny line in between */}
      {/* Outline */}
      <path
        d="M188 116 L232 108 L196 138 Z"
        fill="#0E0A1F"
        transform="scale(1.05) translate(-9.4 -5.5)"
      />
      {/* Upper beak (lighter) */}
      <path d="M190 116 L228 110 L196 130 Z" fill="#FF9500" />
      {/* Lower beak (darker) */}
      <path d="M196 130 L228 110 L200 140 L194 132 Z" fill="#FF7A00" />
      {/* Beak crease */}
      <path
        d="M196 130 L226 112"
        stroke="#0E0A1F" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"
      />

      {/* ===== FEET ===== */}
      {/* Each foot has three toes */}
      <g stroke="#FF7A00" strokeWidth="6" strokeLinecap="round" fill="none">
        {/* Left foot */}
        <path d="M108 208 v 16" />
        <path d="M108 224 l -8 4" />
        <path d="M108 224 l  0 6" />
        <path d="M108 224 l  8 4" />
        {/* Right foot */}
        <path d="M148 208 v 16" />
        <path d="M148 224 l -8 4" />
        <path d="M148 224 l  0 6" />
        <path d="M148 224 l  8 4" />
      </g>
      {/* Foot outlines (darker) */}
      <g stroke="#0E0A1F" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M108 208 v 16" />
        <path d="M148 208 v 16" />
      </g>
    </svg>
  );
}
