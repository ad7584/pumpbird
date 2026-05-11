// ============================================================
// Background — cartoon sky for the bold/playful theme.
//   Layers (back → front):
//     1. Cream sky gradient
//     2. Stationary sun with rays (top-right)
//     3. Scrolling fluffy clouds (slow parallax)
//     4. Rolling green hills along the bottom (faster parallax)
// ============================================================

// Brand palette mirrored from style.css
const COL = {
  cream:   0xFFEFD3,  // sky top
  cream2:  0xFFE2A8,  // sky bottom (slightly warmer)
  sun:     0xFFD63A,  // --pb-yellow
  sunCore: 0xFFE989,
  sunRay:  0xFFB300,
  cloud:   0xFFFFFF,
  cloudShadow: 0xFFE2A8,
  // Hills are lavender so they contrast hard against the green pipes
  hillFar:  0xC9B8FF,  // pale lavender (far layer)
  hillNear: 0x9D7BFF,  // --pb-purple (near layer)
  pink:    0xFF3D8B,
  ink:     0x0E0A1F,
};

// Cloud parallax — slow-moving puffy shapes
const CLOUD_PARALLAX = 0.06;
const HILL_FAR_PARALLAX  = 0.12;
const HILL_NEAR_PARALLAX = 0.20;

export default class Background {
  constructor(scene){
    this.scene = scene;
    this.W = scene.scale.width;
    this.H = scene.scale.height;

    // Static sky + sun (drawn once)
    this.skyGfx = scene.add.graphics();
    this.skyGfx.setDepth(-100);
    this.drawSky();

    this.sunGfx = scene.add.graphics();
    this.sunGfx.setDepth(-99);
    this.drawSun();

    // Scrolling layers
    this.cloudGfx = scene.add.graphics();
    this.cloudGfx.setDepth(-90);
    this.cloudOffset = 0;
    this.clouds = this.buildClouds();

    this.hillFarGfx = scene.add.graphics();
    this.hillFarGfx.setDepth(-80);
    this.hillFarOffset = 0;
    this.hillFar = this.buildHills(/*amp*/ 22, /*step*/ 70, /*baseRatio*/ 0.78);

    this.hillNearGfx = scene.add.graphics();
    this.hillNearGfx.setDepth(-70);
    this.hillNearOffset = 0;
    this.hillNear = this.buildHills(/*amp*/ 30, /*step*/ 90, /*baseRatio*/ 0.88);

    this.drawClouds();
    this.drawHillFar();
    this.drawHillNear();
  }

  // ---- Sky gradient ----
  drawSky(){
    const g = this.skyGfx;
    g.clear();
    const steps = 24;
    for (let i = 0; i < steps; i++){
      const t = i / (steps - 1);
      // simple two-stop blend
      const r = lerp(0xFF, 0xFF, t);
      const gc = lerp(0xEF, 0xE2, t);
      const b = lerp(0xD3, 0xA8, t);
      g.fillStyle((r << 16) | (gc << 8) | b, 1);
      g.fillRect(0, (this.H * i) / steps, this.W, this.H / steps + 1);
    }
  }

  // ---- Sun (top-right) with cartoon rays ----
  drawSun(){
    const g = this.sunGfx;
    g.clear();
    const cx = this.W * 0.78;
    const cy = this.H * 0.16;
    const r  = 42;

    // Rays — chunky triangles around the sun
    const rayCount = 10;
    for (let i = 0; i < rayCount; i++){
      const a  = (i / rayCount) * Math.PI * 2;
      const a1 = a - 0.18;
      const a2 = a + 0.18;
      const inner = r + 6;
      const outer = r + 26;
      g.fillStyle(COL.sunRay, 0.85);
      g.fillTriangle(
        cx + Math.cos(a1) * inner, cy + Math.sin(a1) * inner,
        cx + Math.cos(a)  * outer, cy + Math.sin(a)  * outer,
        cx + Math.cos(a2) * inner, cy + Math.sin(a2) * inner,
      );
    }

    // Outline disc
    g.fillStyle(COL.ink, 1);
    g.fillCircle(cx, cy, r + 2.5);
    // Sun rim
    g.fillStyle(COL.sunRay, 1);
    g.fillCircle(cx, cy, r);
    // Sun core
    g.fillStyle(COL.sun, 1);
    g.fillCircle(cx, cy, r - 4);
    // Inner highlight
    g.fillStyle(COL.sunCore, 1);
    g.fillCircle(cx - r * 0.3, cy - r * 0.3, r * 0.35);
  }

  // ---- Clouds ----
  // We pre-generate a pool of clouds that wrap around as we scroll.
  buildClouds(){
    const clouds = [];
    const totalWidth = this.W * 3;
    let x = -50;
    while (x < totalWidth){
      clouds.push({
        x,
        y: 40 + Math.random() * (this.H * 0.45),
        scale: 0.7 + Math.random() * 0.7,
      });
      x += 90 + Math.random() * 90;
    }
    return { clouds, totalWidth };
  }

  drawClouds(){
    const g = this.cloudGfx;
    g.clear();
    const { clouds, totalWidth } = this.clouds;
    const offset = ((this.cloudOffset % totalWidth) + totalWidth) % totalWidth;
    for (const c of clouds){
      const baseX = c.x - offset;
      // draw cloud at baseX, baseX + totalWidth (wraparound)
      this.drawCloud(g, baseX, c.y, c.scale);
      this.drawCloud(g, baseX + totalWidth, c.y, c.scale);
    }
  }

  drawCloud(g, x, y, s){
    if (x < -120 || x > this.W + 60) return;
    const r1 = 18 * s, r2 = 14 * s, r3 = 16 * s, r4 = 12 * s;

    // Outline
    g.fillStyle(COL.ink, 1);
    g.fillCircle(x,         y,         r1 + 2);
    g.fillCircle(x + 18*s,  y - 6*s,   r2 + 2);
    g.fillCircle(x + 32*s,  y + 2*s,   r3 + 2);
    g.fillCircle(x + 14*s,  y + 8*s,   r4 + 2);

    // Cloud fill
    g.fillStyle(COL.cloud, 1);
    g.fillCircle(x,         y,         r1);
    g.fillCircle(x + 18*s,  y - 6*s,   r2);
    g.fillCircle(x + 32*s,  y + 2*s,   r3);
    g.fillCircle(x + 14*s,  y + 8*s,   r4);

    // Soft underbelly shadow
    g.fillStyle(COL.cloudShadow, 0.8);
    g.fillRect(x - r1 + 4, y + r1 - 2, r1 + 30*s, 3);
  }

  // ---- Rolling hills ----
  // Build a polyline of peak heights, rendered as filled silhouettes.
  buildHills(amp, step, baseRatio){
    const baseY = this.H * baseRatio;
    const points = [];
    const totalWidth = this.W * 3;
    let x = -step;
    let i = 0;
    while (x <= totalWidth + step){
      // Two-frequency noise for natural-feeling hills
      const noise =
        Math.sin(i * 0.7)        * amp *  0.7 +
        Math.sin(i * 0.31 + 1.4) * amp *  0.4;
      points.push({ x, y: baseY - amp - noise });
      x += step;
      i++;
    }
    return { points, baseY, totalWidth };
  }

  drawHillFar(){
    this.drawHillLayer(this.hillFarGfx, this.hillFar, this.hillFarOffset, COL.hillFar);
  }
  drawHillNear(){
    this.drawHillLayer(this.hillNearGfx, this.hillNear, this.hillNearOffset, COL.hillNear);
  }

  drawHillLayer(g, layer, offset, color){
    g.clear();
    const { points, baseY, totalWidth } = layer;
    const o = ((offset % totalWidth) + totalWidth) % totalWidth;

    // Build outlined silhouette by drawing many tall triangles between adjacent points.
    // We render twice (offset 0 and offset +totalWidth) for seamless wrap.
    const renderPass = (shiftX) => {
      // First pass: ink outline, slightly larger
      g.fillStyle(COL.ink, 1);
      for (let i = 0; i < points.length - 1; i++){
        const a = points[i], b = points[i + 1];
        const ax = a.x - o + shiftX, bx = b.x - o + shiftX;
        if (bx < -10 || ax > this.W + 10) continue;
        // Outline polygon: top is the segment shifted up by 3px, bottom is the canvas bottom
        g.fillTriangle(ax, a.y - 3,  bx, b.y - 3,  bx, this.H + 4);
        g.fillTriangle(ax, a.y - 3,  bx, this.H + 4, ax, this.H + 4);
      }
      // Second pass: actual fill
      g.fillStyle(color, 1);
      for (let i = 0; i < points.length - 1; i++){
        const a = points[i], b = points[i + 1];
        const ax = a.x - o + shiftX, bx = b.x - o + shiftX;
        if (bx < -10 || ax > this.W + 10) continue;
        g.fillTriangle(ax, a.y,  bx, b.y,  bx, this.H + 4);
        g.fillTriangle(ax, a.y,  bx, this.H + 4, ax, this.H + 4);
      }
    };
    renderPass(0);
    renderPass(totalWidth);
  }

  // ---- Per-frame ----
  update(scrollSpeed){
    this.cloudOffset    += scrollSpeed * CLOUD_PARALLAX     / 60;
    this.hillFarOffset  += scrollSpeed * HILL_FAR_PARALLAX  / 60;
    this.hillNearOffset += scrollSpeed * HILL_NEAR_PARALLAX / 60;
    this.drawClouds();
    this.drawHillFar();
    this.drawHillNear();
  }
}

function lerp(a, b, t){ return Math.round(a + (b - a) * t); }
