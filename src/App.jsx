// ============================================================
// App root — three-view flow:
//   landing → public marketing page (LandingPage)
//   home    → game home screen with START button (GameHome)
//   game    → Phaser canvas (GameShell)
//
// AudioManager mounts once at the top (NOT inside the view switch)
// so the music keeps playing across navigation.
//
// Score is tracked in localStorage and surfaced on landing + home.
// ============================================================
import { useState, useEffect } from 'react';
import LandingPage  from './react/LandingPage.jsx';
import GameHome     from './react/GameHome.jsx';
import GameShell    from './react/GameShell.jsx';
import AudioManager from './react/AudioManager.jsx';

const BEST_SCORE_KEY = 'pb_best_score';
const LAST_SCORE_KEY = 'pb_last_score';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'home' | 'game'
  const [bestScore, setBestScore] = useState(() => readNum(BEST_SCORE_KEY));
  const [lastScore, setLastScore] = useState(() => readNum(LAST_SCORE_KEY));

  // Toggle a body class while in game view so we can disable
  // page-level animations underneath the canvas.
  useEffect(() => {
    document.body.classList.toggle('in-game', view === 'game');
    return () => document.body.classList.remove('in-game');
  }, [view]);

  // Phaser → React score updates
  useEffect(() => {
    const recordScore = (score) => {
      if (typeof score !== 'number') return;
      writeNum(LAST_SCORE_KEY, score);
      setLastScore(score);
      setBestScore((prev) => {
        const next = Math.max(prev, score);
        if (next !== prev) writeNum(BEST_SCORE_KEY, next);
        return next;
      });
    };
    const onScoreUpdate = (e) => recordScore(e?.detail?.score);
    const onReturnHome  = (e) => {
      recordScore(e?.detail?.score);
      setView('home');
    };
    window.addEventListener('printr:score-update', onScoreUpdate);
    window.addEventListener('printr:return-home', onReturnHome);
    return () => {
      window.removeEventListener('printr:score-update', onScoreUpdate);
      window.removeEventListener('printr:return-home', onReturnHome);
    };
  }, []);

  return (
    <>
      {/* Mounts ONCE — keeps music playing as the view changes. */}
      <AudioManager />
      {renderView(view, {
        bestScore, lastScore,
        onPlay: () => setView('home'),
        onStart: () => setView('game'),
        onBackToLanding: () => setView('landing'),
      })}
    </>
  );
}

function renderView(view, props) {
  if (view === 'game') {
    return (
      <div className="game-view">
        <button
          className="game-back-btn"
          onClick={() =>
            window.dispatchEvent(new CustomEvent('printr:return-home'))
          }
          title="Back to home"
          aria-label="Back to home"
        >
          ← HOME
        </button>
        <GameShell />
      </div>
    );
  }
  if (view === 'home') {
    return (
      <GameHome
        bestScore={props.bestScore}
        lastScore={props.lastScore}
        onStart={props.onStart}
        onBackToLanding={props.onBackToLanding}
      />
    );
  }
  return (
    <LandingPage
      onPlay={props.onPlay}
      bestScore={props.bestScore}
      lastScore={props.lastScore}
    />
  );
}

// --- helpers ---
function readNum(key) {
  try { return parseInt(localStorage.getItem(key) || '0', 10) || 0; }
  catch { return 0; }
}
function writeNum(key, val) {
  try { localStorage.setItem(key, String(val)); } catch {}
}
