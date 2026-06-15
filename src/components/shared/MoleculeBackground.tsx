import React from 'react';

interface Props {
  /** 'default' = molecule + hexagon grid
   *  'dna'     = molecule + DNA double helix (About page) */
  variant?: 'default' | 'dna';
}

/**
 * MoleculeBackground
 *
 * Uses `position: fixed` so it is NEVER clipped by `overflow-hidden` on page wrappers.
 * z-index 1 keeps it above the page background colour but behind all content (z-10+).
 * pointer-events-none ensures no interaction interference.
 */
const MoleculeBackground: React.FC<Props> = ({ variant = 'default' }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* ── Top-left large molecule ─────────────────────────────── */}
      <div className="absolute top-16 left-0" style={{ opacity: 0.15, width: 280, height: 280 }}>
        <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" width="280" height="280">
          {/* Bonds */}
          <line x1="150" y1="150" x2="75"  y2="75"  stroke="#0E8A67" strokeWidth="4"/>
          <line x1="150" y1="150" x2="225" y2="75"  stroke="#0E8A67" strokeWidth="4"/>
          <line x1="150" y1="150" x2="235" y2="200" stroke="#0E8A67" strokeWidth="4"/>
          <line x1="150" y1="150" x2="88"  y2="228" stroke="#0E8A67" strokeWidth="4"/>
          <line x1="150" y1="150" x2="150" y2="248" stroke="#0E8A67" strokeWidth="4"/>
          <line x1="75"  y1="75"  x2="35"  y2="40"  stroke="#0E8A67" strokeWidth="3"/>
          <line x1="225" y1="75"  x2="265" y2="40"  stroke="#0E8A67" strokeWidth="3"/>
          <line x1="235" y1="200" x2="278" y2="218" stroke="#0E8A67" strokeWidth="3"/>
          <line x1="88"  y1="228" x2="52"  y2="270" stroke="#0E8A67" strokeWidth="3"/>
          {/* Outer glow */}
          <circle cx="150" cy="150" r="26" fill="#0E8A67" fillOpacity="0.18"/>
          <circle cx="150" cy="150" r="16" fill="#0E8A67" fillOpacity="0.85"/>
          <circle cx="75"  cy="75"  r="19" fill="#0E8A67" fillOpacity="0.15"/>
          <circle cx="75"  cy="75"  r="12" fill="#0E8A67" fillOpacity="0.85"/>
          <circle cx="225" cy="75"  r="19" fill="#0E8A67" fillOpacity="0.15"/>
          <circle cx="225" cy="75"  r="12" fill="#0E8A67" fillOpacity="0.85"/>
          <circle cx="235" cy="200" r="19" fill="#0E8A67" fillOpacity="0.15"/>
          <circle cx="235" cy="200" r="12" fill="#0E8A67" fillOpacity="0.85"/>
          <circle cx="88"  cy="228" r="19" fill="#0E8A67" fillOpacity="0.15"/>
          <circle cx="88"  cy="228" r="12" fill="#0E8A67" fillOpacity="0.85"/>
          <circle cx="150" cy="248" r="15" fill="#0E8A67" fillOpacity="0.7"/>
          <circle cx="35"  cy="40"  r="11" fill="#0E8A67" fillOpacity="0.65"/>
          <circle cx="265" cy="40"  r="11" fill="#0E8A67" fillOpacity="0.65"/>
          <circle cx="278" cy="218" r="11" fill="#0E8A67" fillOpacity="0.65"/>
          <circle cx="52"  cy="270" r="11" fill="#0E8A67" fillOpacity="0.65"/>
        </svg>
      </div>

      {/* ── Bottom-left small molecule ───────────────────────────── */}
      <div className="absolute bottom-24 left-6" style={{ opacity: 0.1, width: 180, height: 180 }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="180" height="180">
          <line x1="100" y1="100" x2="48"  y2="52"  stroke="#0E8A67" strokeWidth="4"/>
          <line x1="100" y1="100" x2="158" y2="52"  stroke="#0E8A67" strokeWidth="4"/>
          <line x1="100" y1="100" x2="162" y2="148" stroke="#0E8A67" strokeWidth="4"/>
          <line x1="100" y1="100" x2="52"  y2="158" stroke="#0E8A67" strokeWidth="4"/>
          <circle cx="100" cy="100" r="20" fill="#0E8A67" fillOpacity="0.15"/>
          <circle cx="100" cy="100" r="13" fill="#0E8A67" fillOpacity="0.8"/>
          <circle cx="48"  cy="52"  r="14" fill="#0E8A67" fillOpacity="0.65"/>
          <circle cx="158" cy="52"  r="14" fill="#0E8A67" fillOpacity="0.65"/>
          <circle cx="162" cy="148" r="14" fill="#0E8A67" fillOpacity="0.65"/>
          <circle cx="52"  cy="158" r="14" fill="#0E8A67" fillOpacity="0.65"/>
        </svg>
      </div>

      {/* ── Right-side decoration ─────────────────────────────────── */}
      {variant === 'dna' ? (
        /* DNA Double Helix – top-right */
        <div className="absolute top-14 right-0" style={{ opacity: 0.14, width: 220, height: 420 }}>
          <svg viewBox="0 0 180 480" fill="none" xmlns="http://www.w3.org/2000/svg" width="220" height="420">
            {/* Strand A – solid */}
            <path
              d="M90,8 C135,34 152,65 90,90 C28,115 10,146 90,172 C152,198 135,229 90,254 C28,279 10,310 90,336 C152,362 135,393 90,418 C28,443 10,474 90,472"
              stroke="#0E8A67" strokeWidth="5" strokeLinecap="round" fill="none"/>
            {/* Strand B – dashed */}
            <path
              d="M90,8 C45,34 28,65 90,90 C152,115 170,146 90,172 C28,198 45,229 90,254 C152,279 170,310 90,336 C28,362 45,393 90,418 C152,443 170,474 90,472"
              stroke="#0E8A67" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="8 5"/>
            {/* Base-pair rungs */}
            {[44, 90, 134, 172, 216, 260, 304, 346, 390, 434].map((y, i) => (
              <line key={i} x1="42" y1={y} x2="138" y2={y} stroke="#0E8A67" strokeWidth="3.5" strokeLinecap="round"/>
            ))}
            {/* Strand nodes */}
            {[8, 90, 172, 254, 336, 418].map((y, i) => (
              <circle key={i} cx="90" cy={y} r="9" fill="#0E8A67" fillOpacity="0.75"/>
            ))}
            {/* Rung end-nodes */}
            {[44, 134, 216, 304, 390].map((y, i) => (
              <React.Fragment key={i}>
                <circle cx="42"  cy={y} r="7" fill="#0E8A67" fillOpacity="0.6"/>
                <circle cx="138" cy={y} r="7" fill="#0E8A67" fillOpacity="0.6"/>
              </React.Fragment>
            ))}
          </svg>
        </div>
      ) : (
        /* Hexagon lattice – top-right */
        <div className="absolute top-14 right-0" style={{ opacity: 0.12, width: 260, height: 260 }}>
          <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" width="260" height="260">
            <polygon points="65,10 95,10 110,36 95,62 65,62 50,36"        stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="115,10 145,10 160,36 145,62 115,62 100,36"   stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="165,10 195,10 210,36 195,62 165,62 150,36"   stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="40,62 70,62 85,88 70,114 40,114 25,88"       stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="90,62 120,62 135,88 120,114 90,114 75,88"    stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="140,62 170,62 185,88 170,114 140,114 125,88" stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="190,62 220,62 235,88 220,114 190,114 175,88" stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="65,114 95,114 110,140 95,166 65,166 50,140"   stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="115,114 145,114 160,140 145,166 115,166 100,140" stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <polygon points="165,114 195,114 210,140 195,166 165,166 150,140" stroke="#0E8A67" strokeWidth="3.5" fill="none"/>
            <circle cx="200" cy="200" r="6"   fill="#0E8A67"/>
            <circle cx="222" cy="218" r="5"   fill="#0E8A67"/>
            <circle cx="240" cy="204" r="4"   fill="#0E8A67"/>
            <circle cx="214" cy="235" r="3.5" fill="#0E8A67"/>
          </svg>
        </div>
      )}

      {/* ── Scatter dots – bottom-right ──────────────────────────── */}
      <div className="absolute bottom-20 right-8" style={{ opacity: 0.11 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10"  cy="10"  r="5.5" fill="#0E8A67"/>
          <circle cx="34"  cy="22"  r="4.5" fill="#0E8A67"/>
          <circle cx="60"  cy="9"   r="6.5" fill="#0E8A67"/>
          <circle cx="86"  cy="24"  r="5"   fill="#0E8A67"/>
          <circle cx="110" cy="13"  r="4"   fill="#0E8A67"/>
          <circle cx="17"  cy="50"  r="4.5" fill="#0E8A67"/>
          <circle cx="44"  cy="42"  r="6"   fill="#0E8A67"/>
          <circle cx="70"  cy="56"  r="4.5" fill="#0E8A67"/>
          <circle cx="96"  cy="46"  r="5.5" fill="#0E8A67"/>
          <circle cx="120" cy="60"  r="3.5" fill="#0E8A67"/>
          <circle cx="24"  cy="86"  r="5.5" fill="#0E8A67"/>
          <circle cx="54"  cy="80"  r="4"   fill="#0E8A67"/>
          <circle cx="80"  cy="94"  r="5"   fill="#0E8A67"/>
          <circle cx="106" cy="84"  r="4.5" fill="#0E8A67"/>
          <circle cx="34"  cy="118" r="4.5" fill="#0E8A67"/>
          <circle cx="64"  cy="112" r="5.5" fill="#0E8A67"/>
          <circle cx="94"  cy="120" r="4"   fill="#0E8A67"/>
          <circle cx="120" cy="108" r="4.5" fill="#0E8A67"/>
        </svg>
      </div>
    </div>
  );
};

export default MoleculeBackground;
