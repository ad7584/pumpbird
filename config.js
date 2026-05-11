// ============================================================
// PRINTR BIRD — central config
// ALL tunable numbers live here. Change, refresh, done.
//
// ⚠️  PHYSICS / BIRD / SPEED / PIPES / POWERUPS values are
//    ALSO declared in src/sim/physics.js as the SIM constant (which is
//    mirrored byte-for-byte into the backend for replay verification).
//
//    If you change a physics tunable here, you MUST change the matching
//    SIM value in BOTH:
//       printr-bird/src/sim/physics.js
//       printr-bird-backend/src/sim/physics.js
//    Otherwise the server's replay re-simulation will diverge and every
//    submitted score will be rejected.
// ============================================================
export const GAME = {
  WIDTH: 480,
  HEIGHT: 800,
  BG_COLOR: 0xFFEFD3,  // --pb-cream
};
// Physics — calm at start, forgiving feel
export const PHYSICS = {
  GRAVITY: 650,
  FLAP_VEL: -280,
  MAX_FALL: 600,
};
export const BIRD = {
  START_X_RATIO: 0.28,
  VISUAL_R: 22,
  HITBOX_R: 17,
};
// Scroll speed curve — starts slow, ramps up gently, caps so game is endless-playable.
// Game is ENDLESS: pipes keep spawning, speed asymptotes to MAX.
export const SPEED = {
  BASE: 90,
  MAX: 150,
  RAMP_SCORE: 60,
  SPEED_PU_MULT: 1.2,
};
export const PIPES = {
  WIDTH: 55,
  INTERVAL_PX: 320,
  GAP_MAX: 240,
  GAP_MIN: 150,
  CAP_HEIGHT: 24,
};
export const RESPAWN = {
  WINDOW_MS: 5000,
  DAILY_HOLDER_CAP: 3,
  DAILY_NON_HOLDER_CAP: 0,
  MAX_PER_GAME: 1,
  GRACE_SHIELD_MS: 2000,
  COSTS: {
    BIRD_BURN: 1000,
    SOL: 0.0005,
  },
};
export const POWERUPS = {
  DURATION_MS: 8000,
  PRE_GAME_DURATION_MS: 12000,
  SPAWN_CHANCE: 0.08,
  SHOP: [
    { type:'shield', icon:'🛡', name:'Shield',   price:'500 $BIRD' },
    { type:'crown',  icon:'👑', name:'2x Score', price:'800 $BIRD' },
    { type:'speed',  icon:'⚡', name:'Speed',    price:'600 $BIRD' },
  ],
};
export const FEES = {
  NON_HOLDER_PLAY_SOL: 0.001,
};
// Brand colors — bold/playful palette (mirrors style.css)
export const COLORS = {
  PINK:    0xFF3D8B,  // primary accent
  YELLOW:  0xFFD63A,
  ORANGE:  0xFF7A00,
  MINT:    0x6FE3B5,
  CREAM:   0xFFEFD3,
  INK:     0x0E0A1F,
  PAPER:   0xFFFFFF,
  // Legacy aliases — kept so older code paths still resolve
  PURPLE:  0x9D7BFF,
  BLUE:    0x6CC5FF,
  CYAN:    0x6FE3B5,
  GOLD:    0xFFD63A,
};