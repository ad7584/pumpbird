// ============================================================
// PreloadScene
// Phase 1: procedurally generates textures for bird/pipes/pickups
//          so no assets are required to run
// Phase 2: replace the generateTextures() body with this.load.image()
//          calls pointing at /assets/*.png from your sprite pack
// ============================================================
import Phaser from 'phaser';
import { COLORS, BIRD, PIPES } from '../../config.js';

export default class PreloadScene extends Phaser.Scene {
  constructor(){
    super('Preload');
  }

  preload(){
    // Loading bar
    const { width, height } = this.scale;
    const barBg = this.add.rectangle(width/2, height/2, 220, 6, 0x1a0a2e);
    const bar = this.add.rectangle(width/2 - 110, height/2, 0, 6, COLORS.PINK)
      .setOrigin(0, 0.5);
    this.add.text(width/2, height/2 - 30, 'PRINTR BIRD', {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '28px', fontStyle: 'bold', color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(width/2, height/2 + 24, 'loading…', {
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: '11px', color: '#888888', letterSpacing: '0.3em'
    }).setOrigin(0.5);

    this.load.on('progress', (v) => { bar.width = 220 * v; });

    // For Phase 1 we generate textures from the Graphics API inside create()
    // (needs to happen after preload, but we register the fake loader here
    //  so the progress bar looks real)
    this.load.on('complete', () => {
      this.generateProceduralTextures();
    });
  }

  create(){
    // React owns the home page now — Phaser jumps straight into gameplay.
    // No Menu scene exists anymore.
    this.time.delayedCall(300, () => {
      this.scene.start('Game');
      this.scene.launch('UI');
    });
  }

  // ============================================================
  // Generate all game textures procedurally — purely Phase 1.
  // ============================================================
  generateProceduralTextures(){
    this.makeBirdTexture();
    this.makePipeBodyTexture();
    this.makePipeCapTexture();
    this.makePopTexture();
    this.makePowerupTexture('pu_shield', COLORS.CYAN, '🛡');
    this.makePowerupTexture('pu_crown',  COLORS.GOLD, '👑');
    this.makePowerupTexture('pu_speed',  COLORS.PURPLE, '⚡');
    this.makeParticleTexture();
  }

  makeParticleTexture(){
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 3);
    g.generateTexture('particle', 8, 8);
    g.destroy();
  }

  makeBirdTexture(){
    // Bird is drawn directly by Bird.js using Graphics — no texture needed
  }

  makePipeBodyTexture(){
    // Pipes are drawn inline in Pipe.js for the neon glow effect
  }

  makePipeCapTexture(){
    // Same — drawn inline in Pipe.js
  }

  makePopTexture(){
    const size = 28;
    const g = this.add.graphics();
    g.fillStyle(COLORS.PINK, 0.25);
    g.fillCircle(size/2, size/2, size/2);
    const cubic = (p0, p1, p2, p3, steps) => {
      for (let i = 1; i <= steps; i++){
        const t = i / steps, mt = 1 - t;
        const x = mt*mt*mt*p0[0] + 3*mt*mt*t*p1[0] + 3*mt*t*t*p2[0] + t*t*t*p3[0];
        const y = mt*mt*mt*p0[1] + 3*mt*mt*t*p1[1] + 3*mt*t*t*p2[1] + t*t*t*p3[1];
        g.lineTo(x, y);
      }
    };
    g.fillStyle(COLORS.PINK, 1);
    g.beginPath();
    g.moveTo(size/2, 4);
    cubic([size/2, 4], [size-2, 10], [size-2, 22], [size/2, size-2], 12);
    cubic([size/2, size-2], [2, 22], [2, 10], [size/2, 4], 12);
    g.closePath();
    g.fillPath();
    g.fillStyle(COLORS.GOLD, 1);
    g.fillCircle(size/2, size/2 + 3, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(size/2, size/2 + 5, 1.5);
    g.generateTexture('pop_flame', size, size);
    g.destroy();
  }

  makePowerupTexture(key, color, emoji){
    const size = 28;
    const g = this.add.graphics();
    g.fillStyle(color, 0.3);
    g.fillCircle(size/2, size/2, size/2);
    g.fillStyle(color, 1);
    g.fillCircle(size/2, size/2, 10);
    g.lineStyle(2, 0xffffff, 0.8);
    g.strokeCircle(size/2, size/2, 10);
    g.generateTexture(key, size, size);
    g.destroy();
  }
}