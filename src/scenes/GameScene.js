// ============================================================
// GameScene — main gameplay (fun mode, no economy)
// First tap starts the run. Bird hovers until then.
// 350ms input cooldown on scene start to prevent the click that
// brought us here from leaking through and auto-starting the run.
// ============================================================
import Phaser from 'phaser';
import {
  BIRD, PIPES, SPEED, COLORS
} from '../../config.js';
import Bird from '../objects/Bird.js';
import Pipe from '../objects/Pipe.js';
import Background from '../objects/Background.js';
import { createRng, randomSeed } from '../sim/rng.js';
import { spawnPipe } from '../sim/physics.js';

export default class GameScene extends Phaser.Scene {
  constructor(){
    super('Game');
  }

  create(){
    const { width: W, height: H } = this.scale;
    this.W = W; this.H = H;

    this.bg = new Background(this);
    this.bird = new Bird(this, W * BIRD.START_X_RATIO, H / 2);

    this.setupInputs();
    this.resetForNewRun();
  }

  setupInputs(){
    // Fired on every input — but only acts when we're past the cooldown.
    const onInput = () => {
      if (!this.alive) return;
      if (this.time.now < this.inputUnlockAt) return;   // ignore residual clicks
      if (!this.started) {
        this.started = true;
        this.running = true;
        if (this.bird.body) this.bird.body.setAllowGravity(true);
        if (this.startHint)    { this.startHint.destroy();    this.startHint = null; }
        if (this.startHintSub) { this.startHintSub.destroy(); this.startHintSub = null; }
        if (this.startHintTween) { this.startHintTween.stop(); this.startHintTween = null; }
      }
      this.bird.flap();
      window.dispatchEvent(new CustomEvent('printr:sfx', { detail: { name: 'flap' } }));
    };
    this.input.on('pointerdown', onInput);
    this.input.keyboard.on('keydown-SPACE', onInput);
    this.input.keyboard.on('keydown-UP', onInput);
  }

  // Resets all run-time state. Used both at scene create and on Play Again.
  resetForNewRun(){
    const { width: W, height: H } = this.scale;

    // Run state
    this.score = 0;
    this.distance = 0;
    this.lastPipeDist = -PIPES.INTERVAL_PX * 0.5;
    this.frame = 0;
    this.alive = true;
    this.running = false;
    this.started = false;
    // Don't accept input for 350ms — kills the click-through from React/UI buttons.
    this.inputUnlockAt = this.time.now + 350;

    this.seed = randomSeed();
    this.rng = createRng(this.seed);
    this.registry.set('score', 0);

    // Clear pipes from prior run
    if (this.pipes) for (const p of this.pipes) p.destroy();
    this.pipes = [];

    // Reset bird position + state
    this.bird.x = W * BIRD.START_X_RATIO;
    this.bird.y = H / 2;
    if (this.bird.body) {
      this.bird.body.velocity.x = 0;
      this.bird.body.velocity.y = 0;
      this.bird.body.setAllowGravity(false);
    }
    this.bird.setAlive(true);
    if (typeof this.bird.rot !== 'undefined') this.bird.rot = 0;

    // Tap-to-start overlay
    if (this.startHint)    { this.startHint.destroy();    this.startHint = null; }
    if (this.startHintSub) { this.startHintSub.destroy(); this.startHintSub = null; }
    if (this.startHintTween) { this.startHintTween.stop(); this.startHintTween = null; }

    this.startHint = this.add.text(W/2, H * 0.30, 'TAP TO START', {
      fontFamily: '"Bagel Fat One","Lilita One","Fredoka One",sans-serif',
      fontSize: '36px', color: '#0E0A1F',
    }).setOrigin(0.5).setLetterSpacing(2).setDepth(100);
    this.startHint.setShadow(3, 3, '#FFD63A', 0, false, false);
    this.startHintSub = this.add.text(W/2, H * 0.36, 'tap · space · ↑ to flap', {
      fontFamily: '"DM Sans",system-ui,sans-serif',
      fontSize: '13px', fontStyle: 'bold', color: '#0E0A1F',
    }).setOrigin(0.5).setDepth(100);
    this.startHintSub.setAlpha(0.7);

    this.startHintTween = this.tweens.add({
      targets: this.startHint,
      scale: 1.04,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.events.emit('ui:score', 0);
    this.events.emit('ui:reset');
  }

  update(time, dt){
    this.frame++;

    this.bg.update(this.running ? this.getSpeed() : SPEED.BASE * 0.4);

    if (this.alive){
      if (this.started){
        // Run has begun — full physics
        this.bird.update(dt);
      } else {
        // Pre-start — bird hovers and bobs gently in place. No gravity.
        this.bird.updateIdle(dt, this.H / 2);
      }
    } else {
      this.bird.updateDead(dt);
    }

    if (!this.running) return;

    const scrollDx = this.getSpeed() * (1/60);
    this.distance += scrollDx;

    for (const p of this.pipes) p.advance(scrollDx);

    for (let i = this.pipes.length - 1; i >= 0; i--){
      if (this.pipes[i].offscreen()){
        this.pipes[i].destroy();
        this.pipes.splice(i, 1);
      }
    }

    if (this.distance - this.lastPipeDist > PIPES.INTERVAL_PX){
      this.spawnPipePair();
      this.lastPipeDist = this.distance;
    }

    for (const p of this.pipes){
      if (!p.scored && p.x + PIPES.WIDTH < this.bird.x){
        p.scored = true;
        this.score += 1;
        this.registry.set('score', this.score);
        this.events.emit('ui:score', this.score);
        window.dispatchEvent(new CustomEvent('printr:sfx', { detail: { name: 'score' } }));
        this.tone(800, 0.1, 'triangle', 0.12);
        this.time.delayedCall(60, () => this.tone(1200, 0.08, 'triangle', 0.1));
      }
    }

    this.checkPipeCollision();

    if (this.bird.y + BIRD.HITBOX_R > this.H - 4){
      this.bird.y = this.H - 4 - BIRD.HITBOX_R;
      this.triggerHit();
    }
    if (this.bird.y - BIRD.HITBOX_R < 0){
      this.bird.y = BIRD.HITBOX_R;
      this.bird.body.velocity.y = 0;
    }
  }

  getSpeed(){
    if (!this.running) return SPEED.BASE * 0.6;
    const t = Phaser.Math.Clamp(this.score / SPEED.RAMP_SCORE, 0, 1);
    return Phaser.Math.Linear(SPEED.BASE, SPEED.MAX, t);
  }

  getGap(){
    const t = Phaser.Math.Clamp(this.score / SPEED.RAMP_SCORE, 0, 1);
    return Phaser.Math.Linear(PIPES.GAP_MAX, PIPES.GAP_MIN, t);
  }

  spawnPipePair(){
    const spawn = spawnPipe(this.rng, this.score);
    this.pipes.push(new Pipe(this, this.W + 20, spawn.gapY, spawn.gapH, this.H));
  }

  checkPipeCollision(){
    if (!this.alive) return;
    const bx = this.bird.x, by = this.bird.y;
    const hR = BIRD.HITBOX_R;
    for (const p of this.pipes){
      if (p.x + PIPES.WIDTH < bx - hR) continue;
      if (p.x > bx + hR) continue;
      const inGap = by - hR > p.gapY && by + hR < p.gapY + p.gapH;
      if (!inGap){
        this.triggerHit();
        return;
      }
    }
  }

  triggerHit(){
    if (!this.alive) return;
    this.alive = false;
    this.running = false;
    this.bird.setAlive(false);
    this.cameras.main.shake(250, 0.012);
    this.emitBurst(this.bird.x, this.bird.y, COLORS.PINK, 30);
    this.tone(140, 0.25, 'sawtooth', 0.2, -80);
    window.dispatchEvent(new CustomEvent('printr:sfx', { detail: { name: 'gameover' } }));
    this.time.delayedCall(600, () => this.finalizeDeath());
  }

  finalizeDeath(){
    this.tone(200, 0.4, 'sawtooth', 0.18, -150);
    this.time.delayedCall(200, () => this.tone(80, 0.5, 'sawtooth', 0.15, -40));
    this.scene.get('UI').showGameOver({ score: this.score });
  }

  emitBurst(x, y, color, count){
    if (!this.textures.exists('particle')) return;
    const parts = this.add.particles(x, y, 'particle', {
      lifespan: 500,
      speed: { min: 60, max: 180 },
      scale: { start: 0.6, end: 0 },
      tint: color,
      quantity: count,
      emitting: false,
    });
    parts.explode(count);
    this.time.delayedCall(600, () => parts.destroy());
  }

  tone(freq, dur = 0.1, type = 'sine', vol = 0.15, slide = 0){
    try {
      // Respect global mute toggle from AudioManager
      if (typeof localStorage !== 'undefined' && localStorage.getItem('pb_muted') === '1') return;
      const a = this.sound.context;
      if (!a || a.state === 'suspended') return;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = type;
      o.frequency.value = freq;
      if (slide) o.frequency.exponentialRampToValueAtTime(
        Math.max(20, freq + slide), a.currentTime + dur
      );
      // Scale down to ~30% of the original volume so the synth blips
      // sit politely under any background music.
      g.gain.value = vol * 0.3;
      g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
      o.connect(g); g.connect(a.destination);
      o.start(); o.stop(a.currentTime + dur);
    } catch(e){}
  }
}