// ============================================================
// SITE CONFIG — edit every user-facing string for the landing page here.
//
// To change a piece of text or a link, just edit the matching value below.
// Save the file; the dev server hot-reloads instantly.
// ============================================================

// ─── Leaderboard countdown ──────────────────────────────────
// ISO 8601, UTC. Used by the countdown timer.
export const LEADERBOARD_LAUNCH_DATE = '2026-05-15T17:00:00Z';

// ─── Brand strings ──────────────────────────────────────────
export const BRAND = {
  name:    'PUMP BIRD',
  tagline: 'PUMP · WIN · REPEAT',
  subline: 'Your favourite game, now on-chain',
};

// ─── Token / coin details ───────────────────────────────────
export const TOKEN = {
  symbol: '$PUMPBIRD',
  network: 'Solana',
  contractAddress: '6bcVLzU1syRa9YMyqLbqqZ1dfJfwXVfE54wDxJp2pump', // paste real CA when ready
  perks: [
    'Free plays for holders',
    'Buy back and burns',
    'Leaderboard prize access',
  ],
};

// ─── Socials ────────────────────────────────────────────────
// Empty string = hidden.
export const SOCIALS = {
  x:        'https://x.com/AdriaCalls/status/2053917682513375270',
  telegram: '',  // e.g. 'https://t.me/printrbird'
  discord:  '',  // e.g. 'https://discord.gg/printr'
};

// ─── Hero section ───────────────────────────────────────────
export const HERO = {
  eyebrow: 'BUILT ON SOLANA · OFFICIAL GAME',
  // Each entry is one line of the big stacked title.
  // Add or remove lines; the design accommodates 2-4 lines.
  titleLines: ['PUMP.', 'WIN.', 'REPEAT.'],
  // Which line index gets the pink accent + ink shadow (0-indexed)?
  accentLineIndex: 1,
  blurb:
    'Your favourite game now on-chain. Endless flappy gameplay. ' +
    'Compete for prizes when the leaderboard goes live.',
  primaryCta:   'PLAY NOW',
  secondaryCta: 'LEARN MORE',
  birdBadge:    'CHIRP!',  // floating badge on the bird card
};

// ─── Section titles (countdown + coin + about) ──────────────
export const SECTIONS = {
  timer: {
    tag:           '⏱ LEADERBOARD',
    titleLive:     'IS LIVE',           // shown after launch date passes
    titleUpcoming: 'IN',                // shown before launch
    titlePrefix:   'STARTS',
    subLive:       'The board is open — climb it.',
    // {date} is replaced with the formatted launch date.
    subUpcoming:   'Practice now. Compete on {date}.',
  },
  coin: {
    tag: '💎 THE COIN',
    titlePrefix:  '$PUMPBIRD',  // appears before the accent
    titleAccent:  'on Solana',
    sub:          'Hold $PUMPBIRD → unlock perks across the game.',
    contractLabel:'CONTRACT',
    buyButton:    'BUY $PUMPBIRD',
    copiedLabel:  '✓ COPIED',
    networkLabel: 'Solana · Pump.fun Launchpad',
  },
  about: {
    tag:         '🐤 ABOUT',
    titlePrefix: 'Built different.',
    titleAccent: 'Fly forever.',
  },
  finalCta: {
    titlePrefix: 'Stop scrolling.',
    titleAccent: 'Start flying.',
    button:      'PLAY NOW',
  },
};

// ─── About / feature cards ──────────────────────────────────
// Add, remove, or rearrange cards freely.
export const FEATURES = [
  { emoji: '♾️', title: 'ENDLESS RUNS',
    body:  'Speed and gap plateau. No artificial death — pure skill.' },
  { emoji: '🎁', title: 'REWARDS HOLDERS',
    body:  '$PUMPBIRD holders get free plays, free boosters, and prize access.' },
  { emoji: '⛓️', title: 'ON-CHAIN',
    body:  'Native to Solana. Prizes settle on-chain.' },
  { emoji: '📱', title: 'MOBILE READY',
    body:  'Plays great on phone, tablet, and desktop.' },
];

// ─── Header nav links ───────────────────────────────────────
// These scroll to in-page anchors. The href must match the section's id.
export const NAV = [
  { label: 'ABOUT',       href: '#about' },
  { label: 'COIN',        href: '#coin' },
  { label: 'LEADERBOARD', href: '#timer' },
];

// ─── Footer ─────────────────────────────────────────────────
export const FOOTER = {
  brandLine: 'PUMP BIRD · BUILT ON SOLANA',
  // Pulls from BRAND.tagline by default, but you can override here:
  tagline:   null,
};
