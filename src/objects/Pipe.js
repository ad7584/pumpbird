// ============================================================
// Pipe — chunky cartoon style. Thick black outline, mint fill,
//   wider cap with pink accent ring. Cartoon "neo-brutalist" vibe.
// ============================================================
import { PIPES } from '../../config.js';

// Cartoon palette — mirrors brand vars
const FILL      = 0x6FE3B5;  // --pb-mint
const FILL_DARK = 0x46BD8E;  // shadow side of pipe
const CAP_FILL  = 0xFFD63A;  // --pb-yellow on caps for contrast
const ACCENT    = 0xFF3D8B;  // --pb-pink
const INK       = 0x0E0A1F;  // --pb-ink (outline + cartoon shadow)

const OUTLINE_W = 4;          // thick black outline
const CAP_OVERHANG = 8;       // cap is wider than the body

export default class Pipe {
  constructor(scene, x, gapY, gapH, worldH){
    this.scene = scene;
    this.x = x;
    this.gapY = gapY;
    this.gapH = gapH;
    this.worldH = worldH;
    this.scored = false;
    this.dead = false;

    this.gfx = scene.add.graphics();
    this.gfx.setDepth(10);
    this.draw();
  }

  advance(dx){
    this.x -= dx;
    this.draw();
  }

  offscreen(){
    return this.x + PIPES.WIDTH < -CAP_OVERHANG - 2;
  }

  destroy(){
    this.dead = true;
    this.gfx.destroy();
  }

  // ---- Drawing ----

  // Pipe body: outlined rect with a darker right edge for cartoon shading,
  //            a pink dashed accent line down the center, and a mint fill.
  drawBody(g, x, y, w, h){
    if (h <= 0) return;
    // Outline
    g.fillStyle(INK, 1);
    g.fillRect(x - OUTLINE_W, y, w + OUTLINE_W * 2, h);
    // Main fill
    g.fillStyle(FILL, 1);
    g.fillRect(x, y, w, h);
    // Right-side shadow stripe (cartoon shading)
    g.fillStyle(FILL_DARK, 1);
    g.fillRect(x + w * 0.66, y, w * 0.34, h);
    // Pink dashed accent line down the middle
    g.fillStyle(ACCENT, 1);
    const dashLen = 14, gap = 10;
    for (let dy = y + 6; dy < y + h - 6; dy += dashLen + gap){
      const segH = Math.min(dashLen, (y + h - 6) - dy);
      if (segH > 0) g.fillRect(x + w * 0.5 - 1.5, dy, 3, segH);
    }
  }

  // Pipe cap: wider rounded-rect with chunky outline, yellow fill, pink stripe.
  drawCap(g, x, y, w, capH){
    const cx = x - CAP_OVERHANG;
    const cw = w + CAP_OVERHANG * 2;
    // Outline
    g.fillStyle(INK, 1);
    g.fillRoundedRect(cx - OUTLINE_W, y - OUTLINE_W, cw + OUTLINE_W * 2, capH + OUTLINE_W * 2, 8);
    // Yellow cap
    g.fillStyle(CAP_FILL, 1);
    g.fillRoundedRect(cx, y, cw, capH, 6);
    // Pink stripe across the cap
    g.fillStyle(ACCENT, 1);
    g.fillRect(cx + 4, y + capH * 0.45, cw - 8, capH * 0.18);
    // Tiny ink line at bottom of cap for cartoon depth
    g.fillStyle(INK, 0.18);
    g.fillRect(cx, y + capH - 3, cw, 3);
  }

  draw(){
    if (this.dead) return;
    const g = this.gfx;
    const W = PIPES.WIDTH;
    const capH = PIPES.CAP_HEIGHT;
    const H = this.worldH;
    const X = this.x;
    g.clear();

    // ----- Top pipe -----
    const topBodyH = Math.max(0, this.gapY - capH);
    if (topBodyH > 0){
      this.drawBody(g, X, 0, W, topBodyH);
      this.drawCap(g, X, this.gapY - capH, W, capH);
    }

    // ----- Bottom pipe -----
    const botCapY  = this.gapY + this.gapH;
    const botBodyY = botCapY + capH;
    const botBodyH = H - botBodyY;
    if (botBodyH > 0){
      this.drawCap(g, X, botCapY, W, capH);
      this.drawBody(g, X, botBodyY, W, botBodyH);
    }
  }
}
