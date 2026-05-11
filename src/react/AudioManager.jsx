// ============================================================
// AudioManager — background music + SFX with mute toggle.
//
// Drop audio files into /public/sounds/ (see public/sounds/README.md)
// and they'll auto-load. Missing files are silently skipped.
//
// Browsers block autoplay until the user interacts with the page;
// this manager waits for the first click/keypress to start music.
//
// Other parts of the app trigger SFX with window events:
//   window.dispatchEvent(new CustomEvent('printr:sfx', { detail: { name: 'flap' } }));
//
// User toggles mute with the speaker button (persisted in localStorage).
// ============================================================
import { useEffect, useRef, useState } from 'react';

const MUTE_KEY = 'pb_muted';
const VOLUME_MUSIC = 0.30;
const VOLUME_SFX   = 0.30;

export default function AudioManager() {
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(MUTE_KEY) === '1'; } catch { return false; }
  });

  // Refs survive across renders without causing reloads
  const musicRef = useRef(null);
  const sfxPoolRef = useRef({}); // { flap: HTMLAudioElement, score: ..., gameover: ... }
  const startedRef = useRef(false);

  // ---- Setup audio elements once ----
  useEffect(() => {
    const music = new Audio('/sounds/music.mp3');
    music.loop = true;
    music.volume = muted ? 0 : VOLUME_MUSIC;
    music.preload = 'auto';
    musicRef.current = music;

    const makeSfx = (name) => {
      const a = new Audio(`/sounds/${name}.mp3`);
      a.volume = muted ? 0 : VOLUME_SFX;
      a.preload = 'auto';
      return a;
    };
    sfxPoolRef.current = {
      flap:     makeSfx('flap'),
      score:    makeSfx('score'),
      gameover: makeSfx('gameover'),
    };

    // Start music after first user interaction (autoplay policies)
    const startMusic = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (!muted) music.play().catch(() => { /* file missing or blocked — fine */ });
    };
    window.addEventListener('pointerdown', startMusic, { once: true });
    window.addEventListener('keydown',     startMusic, { once: true });

    // Listen for SFX events from anywhere in the app
    const onSfx = (e) => {
      const name = e?.detail?.name;
      const pool = sfxPoolRef.current;
      if (!pool[name]) return;
      // Clone so overlapping plays don't cancel each other
      try {
        const clone = pool[name].cloneNode();
        clone.volume = muted ? 0 : VOLUME_SFX;
        clone.play().catch(() => {});
      } catch {}
    };
    window.addEventListener('printr:sfx', onSfx);

    return () => {
      window.removeEventListener('pointerdown', startMusic);
      window.removeEventListener('keydown',     startMusic);
      window.removeEventListener('printr:sfx',  onSfx);
      music.pause();
      music.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Setup once — mute changes handled in the next effect

  // ---- React to mute changes ----
  useEffect(() => {
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch {}
    const music = musicRef.current;
    if (!music) return;
    music.volume = muted ? 0 : VOLUME_MUSIC;
    if (muted) {
      music.pause();
    } else if (startedRef.current) {
      music.play().catch(() => {});
    }
    Object.values(sfxPoolRef.current).forEach((a) => {
      a.volume = muted ? 0 : VOLUME_SFX;
    });
  }, [muted]);

  return (
    <button
      className="audio-toggle"
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? <SpeakerMutedIcon /> : <SpeakerIcon />}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
      <path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}
function SpeakerMutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
      <line x1="23" y1="9"  x2="17" y2="15" />
      <line x1="17" y1="9"  x2="23" y2="15" />
    </svg>
  );
}
