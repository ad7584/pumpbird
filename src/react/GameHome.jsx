// ============================================================
// GameHome — pre-game screen between landing and the Phaser canvas.
// Shows: cartoon bird (idle bobbing), START button, best/last score,
// and a back button to return to the landing page.
// ============================================================
import { useEffect, useState } from 'react';
import BirdSVG from './BirdSVG.jsx';

export default function GameHome({
  bestScore = 0,
  lastScore = 0,
  onStart,
  onBackToLanding,
}) {
  // Trigger entry animation once on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Press SPACE / ENTER to start
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onStart?.();
      } else if (e.code === 'Escape') {
        onBackToLanding?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart, onBackToLanding]);

  return (
    <div className={`gh ${mounted ? 'gh-mounted' : ''}`}>
      {/* Decorative chunky shapes */}
      <div className="gh-bg" aria-hidden>
        <div className="gh-shape gh-shape-1" />
        <div className="gh-shape gh-shape-2" />
        <div className="gh-shape gh-shape-3" />
      </div>

      <button
        className="gh-back"
        onClick={onBackToLanding}
        aria-label="Back to landing page"
      >
        ← BACK
      </button>

      <div className="gh-card">
        <div className="gh-eyebrow">
          <span className="gh-eyebrow-dot" />
          READY TO FLY
        </div>

        <h1 className="gh-title">
          PUMP <span className="gh-title-accent">BIRD</span>
        </h1>

        <div className="gh-bird-stage">
          <div className="gh-bird-shadow" />
          <BirdSVG className="gh-bird" />
        </div>

        <div className="gh-scores">
          <ScoreBlock label="BEST"  value={bestScore} accent />
          <ScoreBlock label="LAST"  value={lastScore} />
        </div>

        <button className="gh-start" onClick={onStart}>
          <span className="gh-start-label">START</span>
          <span className="gh-start-arrow">▶</span>
        </button>

        <div className="gh-hint">tap · space · ↑ to flap</div>
      </div>
    </div>
  );
}

function ScoreBlock({ label, value, accent }) {
  return (
    <div className={`gh-score ${accent ? 'gh-score-accent' : ''}`}>
      <div className="gh-score-lbl">{label}</div>
      <div className="gh-score-val">{value || 0}</div>
    </div>
  );
}
