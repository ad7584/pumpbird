// ============================================================
// Bird — detailed cartoon, matches the website's BirdSVG component.
//   Features: hair tuft, eyebrow, sparkle eye, tail feathers,
//             three-feather wing, two-tone beak, three-toe feet.
// ============================================================
import Phaser from 'phaser';
import { BIRD, PHYSICS } from '../../config.js';

// Cartoon palette — mirrors brand vars in style.css
const BODY    = 0xFFD63A;
const BODY_HL = 0xFFF3B8;   // top-left highlight
const BELLY   = 0xFFE989;
const WING    = 0xFFB300;
const WING_HL = 0xE59800;   // inner wing accent
const TAIL_A  = 0xFFB300;
const TAIL_B  = 0xFFD63A;
const BEAK_TOP = 0xFF9500;
const BEAK_BOT = 0xFF7A00;
const CHEEK   = 0xFF8FBE;
const CHEEK_HL = 0xFFB3CD;
const HAIR    = 0xFF7A00;
const FOOT    = 0xFF7A00;
const INK     = 0x0E0A1F;
const EYE_W   = 0xFFFFFF;

export default class Bird {
  constructor(scene, x, y){
    this.scene = scene;

    // Invisible physics anchor
    if (!scene.textures.exists('bird_phys')){
      const tg = scene.add.graphics();
      tg.fillStyle(0xffffff, 0);
      tg.fillRect(0, 0, 4, 4);
      tg.generateTexture('bird_phys', 4, 4);
      tg.destroy();
    }

    this.sprite = scene.physics.add.sprite(x, y, 'bird_phys');
    this.sprite.body.setCircle(BIRD.HITBOX_R, -BIRD.HITBOX_R + 2, -BIRD.HITBOX_R + 2);
    this.sprite.body.setAllowGravity(false);
    this.sprite.setVisible(false);
    this.sprite.birdRef = this;

    this.gfx = scene.add.graphics();
    this.gfx.setDepth(20);

    this.alive  = true;
    this.flapT  = 0;
    this.rot    = 0;
    this.idleT  = 0;
    this.activePowerups = [];

    this.redraw();
  }

  get x(){ return this.sprite.x; }
  set x(v){ this.sprite.x = v; }
  get y(){ return this.sprite.y; }
  set y(v){ this.sprite.y = v; }
  get body(){ return this.sprite.body; }

  setAlive(a){ this.alive = a; }

  flap(){
    if (!this.alive) return;
    this.sprite.body.setVelocityY(PHYSICS.FLAP_VEL);
    this.flapT = -1.5;
  }

  update(dt){
    const dtSec = dt / 1000;
    this.sprite.body.velocity.y += PHYSICS.GRAVITY * dtSec;
    if (this.sprite.body.velocity.y > PHYSICS.MAX_FALL){
      this.sprite.body.velocity.y = PHYSICS.MAX_FALL;
    }
    const targetRot = Phaser.Math.Clamp(this.sprite.body.velocity.y * 0.004, -0.45, 1.05);
    this.rot = Phaser.Math.Linear(this.rot, targetRot, 0.12);
    this.flapT += 0.01 * dt + Math.abs(this.sprite.body.velocity.y) * 0.00008 * dt;
    this.redraw();
  }

  updateIdle(dt, baseY){
    this.idleT += dt / 1000;
    this.sprite.y = baseY + Math.sin(this.idleT * 2) * 8;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.rot = Math.sin(this.idleT * 2) * 0.06;
    this.flapT += 0.05;
    this.redraw();
  }

  updateDead(dt){
    const dtSec = dt / 1000;
    this.sprite.body.velocity.y += PHYSICS.GRAVITY * dtSec;
    this.rot = Math.min(this.rot + 0.03, 1.5);
    this.redraw();
  }

  destroy(){
    this.gfx.destroy();
    this.sprite.destroy();
  }

  // ============================================================
  // Drawing — all units scaled relative to R = BIRD.VISUAL_R
  // ============================================================
  redraw(){
    const g = this.gfx;
    const R = BIRD.VISUAL_R;
    g.clear();

    g.save();
    g.translateCanvas(this.sprite.x, this.sprite.y);
    g.rotateCanvas(this.rot);

    // ---- Ground shadow ----
    g.fillStyle(0x000000, 0.16);
    g.fillEllipse(0, R + 8, R * 1.5, 5);

    // ---- Tail feathers (behind body) ----
    // Three overlapping curved feathers
    this.drawTailFeather(g, -R * 0.85, -R * 0.05, R * 0.55, R * 0.35, TAIL_A);
    this.drawTailFeather(g, -R * 0.95, R * 0.20, R * 0.60, R * 0.30, TAIL_B);
    this.drawTailFeather(g, -R * 0.85, R * 0.45, R * 0.55, R * 0.30, TAIL_A);

    // ---- Body outline (drawn as ring) ----
    g.fillStyle(INK, 1);
    g.fillCircle(0, 0, R + 2.5);

    // ---- Body ----
    g.fillStyle(BODY, 1);
    g.fillCircle(0, 0, R);

    // Belly
    g.fillStyle(BELLY, 1);
    g.fillEllipse(0, R * 0.38, R * 1.08, R * 0.80);

    // Top-left highlight
    g.fillStyle(BODY_HL, 0.7);
    g.fillEllipse(-R * 0.35, -R * 0.45, R * 0.28, R * 0.18);

    // ---- Hair tuft (top of head) ----
    this.drawHairTuft(g, 0, -R);

    // ---- Wing (animated) ----
    const wingAngle = Math.sin(this.flapT) * 0.55;
    g.save();
    g.translateCanvas(-R * 0.28, -R * 0.02);
    g.rotateCanvas(wingAngle);
    this.drawWing(g, R);
    g.restore();

    // ---- Eyebrow ----
    // Slight arc above the eye (drawn as a thin filled crescent)
    g.fillStyle(INK, 1);
    this.drawArc(g, R * 0.52, -R * 0.72, R * 0.32, -0.5, 0.5, 5);

    // ---- Eye ----
    // Outline
    g.fillStyle(INK, 1);
    g.fillCircle(R * 0.46, -R * 0.42, R * 0.34);
    // White
    g.fillStyle(EYE_W, 1);
    g.fillCircle(R * 0.46, -R * 0.42, R * 0.28);
    // Iris
    g.fillStyle(INK, 1);
    g.fillCircle(R * 0.52, -R * 0.40, R * 0.17);
    // Big sparkle
    g.fillStyle(EYE_W, 1);
    g.fillCircle(R * 0.58, -R * 0.46, R * 0.07);
    // Small sparkle
    g.fillStyle(EYE_W, 1);
    g.fillCircle(R * 0.46, -R * 0.32, R * 0.03);

    // ---- Cheek blush ----
    g.fillStyle(CHEEK, 0.85);
    g.fillEllipse(R * 0.36, R * 0.20, R * 0.22, R * 0.14);
    g.fillStyle(CHEEK_HL, 0.9);
    g.fillEllipse(R * 0.32, R * 0.18, R * 0.07, R * 0.05);

    // ---- Beak (two-tone) ----
    this.drawBeak(g, R);

    // ---- Feet (three-toe each) ----
    this.drawFoot(g, -R * 0.20, R * 0.95);
    this.drawFoot(g,  R * 0.18, R * 0.95);

    g.restore();
  }

  // Hair tuft: a small curly orange feather sticking up from head crown.
  drawHairTuft(g, cx, cy){
    const R = BIRD.VISUAL_R;
    // Outline
    g.fillStyle(INK, 1);
    g.fillTriangle(
      cx - R * 0.10, cy + R * 0.05,
      cx + R * 0.10, cy + R * 0.05,
      cx + R * 0.04, cy - R * 0.32,
    );
    g.fillTriangle(
      cx - R * 0.08, cy + R * 0.05,
      cx + R * 0.12, cy + R * 0.05,
      cx + R * 0.18, cy - R * 0.20,
    );
    // Fill
    g.fillStyle(HAIR, 1);
    g.fillTriangle(
      cx - R * 0.06, cy + R * 0.04,
      cx + R * 0.08, cy + R * 0.04,
      cx + R * 0.04, cy - R * 0.27,
    );
    g.fillTriangle(
      cx - R * 0.05, cy + R * 0.04,
      cx + R * 0.10, cy + R * 0.04,
      cx + R * 0.15, cy - R * 0.16,
    );
  }

  // Wing with three feather-tip dividers.
  drawWing(g, R){
    // Outline (slightly larger underneath)
    g.fillStyle(INK, 1);
    g.fillEllipse(0, R * 0.10, R * 1.05, R * 0.78);
    // Main fill
    g.fillStyle(WING, 1);
    g.fillEllipse(0, R * 0.10, R * 0.98, R * 0.72);
    // Inner darker accent — a small inset ellipse
    g.fillStyle(WING_HL, 0.6);
    g.fillEllipse(-R * 0.05, R * 0.05, R * 0.55, R * 0.34);
    // Three feather-tip divider lines (drawn as small dark triangles)
    g.fillStyle(INK, 1);
    g.fillTriangle(-R * 0.40, R * 0.40, -R * 0.36, R * 0.46, -R * 0.42, R * 0.48);
    g.fillTriangle(-R * 0.15, R * 0.44, -R * 0.10, R * 0.50, -R * 0.17, R * 0.52);
    g.fillTriangle( R * 0.10, R * 0.42,  R * 0.15, R * 0.48,  R * 0.08, R * 0.50);
  }

  // Beak: outlined two-tone triangle (upper lighter orange, lower darker)
  drawBeak(g, R){
    const tipX  = R + R * 0.40;
    const baseX = R * 0.78;
    // Outline triangle (slightly larger)
    g.fillStyle(INK, 1);
    g.fillTriangle(
      baseX - 1, -R * 0.10 - 2,
      tipX  + 4,  -R * 0.04,
      baseX - 1,  R * 0.32 + 2,
    );
    // Upper beak (lighter)
    g.fillStyle(BEAK_TOP, 1);
    g.fillTriangle(
      baseX, -R * 0.10,
      tipX,  -R * 0.04,
      baseX,  R * 0.10,
    );
    // Lower beak (darker)
    g.fillStyle(BEAK_BOT, 1);
    g.fillTriangle(
      baseX,  R * 0.10,
      tipX,  -R * 0.04,
      baseX,  R * 0.30,
    );
    // Crease line
    g.lineStyle(2, INK, 0.55);
    g.beginPath();
    g.moveTo(baseX,  R * 0.10);
    g.lineTo(tipX,  -R * 0.04);
    g.strokePath();
  }

  // Single foot with three toes (radiating from a top point).
  drawFoot(g, cx, cy){
    const R = BIRD.VISUAL_R;
    const len = R * 0.20;
    const top = cy;
    const bottom = cy + len;
    // Vertical leg (outline + fill)
    g.lineStyle(5, INK, 0.5);
    g.beginPath();
    g.moveTo(cx, top);
    g.lineTo(cx, bottom);
    g.strokePath();
    g.lineStyle(4, FOOT, 1);
    g.beginPath();
    g.moveTo(cx, top);
    g.lineTo(cx, bottom);
    g.strokePath();
    // Three toes
    const toeLen = R * 0.13;
    const drawToe = (dx, dy) => {
      g.lineStyle(4, FOOT, 1);
      g.beginPath();
      g.moveTo(cx, bottom);
      g.lineTo(cx + dx, bottom + dy);
      g.strokePath();
    };
    drawToe(-toeLen, toeLen * 0.6);
    drawToe(0,       toeLen);
    drawToe( toeLen, toeLen * 0.6);
  }

  // Filled arc (used for eyebrow) — approximates an arc segment as a polygon.
  drawArc(g, cx, cy, radius, startAngle, endAngle, thickness){
    const steps = 12;
    const points = [];
    for (let i = 0; i <= steps; i++){
      const a = startAngle + (endAngle - startAngle) * (i / steps);
      points.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
    }
    for (let i = 0; i <= steps; i++){
      const a = endAngle - (endAngle - startAngle) * (i / steps);
      points.push({ x: cx + Math.cos(a) * (radius - thickness), y: cy + Math.sin(a) * (radius - thickness) });
    }
    g.beginPath();
    g.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++){
      g.lineTo(points[i].x, points[i].y);
    }
    g.closePath();
    g.fillPath();
  }

  // Single tail feather — outlined teardrop shape.
  drawTailFeather(g, cx, cy, w, h, color){
    g.fillStyle(INK, 1);
    g.fillEllipse(cx, cy, w + 4, h + 4);
    g.fillStyle(color, 1);
    g.fillEllipse(cx, cy, w, h);
  }
}
