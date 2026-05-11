// ============================================================
// UIScene — HUD + game-over modal, cartoon/playful style.
//   Score is a chunky pink badge with thick black outline.
//   Game over uses cream card with offset cartoon shadow,
//   yellow score disk, big pink PLAY AGAIN button.
// PLAY AGAIN resets state in-place. GO TO HOME emits return-home.
// ============================================================
import Phaser from 'phaser';

// Brand palette (mirrors style.css)
const C = {
  pink:   0xFF3D8B,
  pinkD:  0xC8226A,
  yellow: 0xFFD63A,
  cream:  0xFFEFD3,
  paper:  0xFFFFFF,
  ink:    0x0E0A1F,
};
const HEX = {
  pink:   '#FF3D8B',
  yellow: '#FFD63A',
  cream:  '#FFEFD3',
  paper:  '#FFFFFF',
  ink:    '#0E0A1F',
  white:  '#FFFFFF',
};

// Use the same display font that the website uses; falls back gracefully.
const DISPLAY_FONT = '"Bagel Fat One","Lilita One","Fredoka One",sans-serif';
const BODY_FONT    = '"DM Sans",system-ui,sans-serif';

export default class UIScene extends Phaser.Scene {
  constructor(){
    super('UI');
  }

  create(){
    const { width: W, height: H } = this.scale;
    this.W = W; this.H = H;

    // ----- Score badge (top of screen) -----
    // A chunky pink pill with thick black outline and offset shadow.
    const badgeY = 48;
    this.scoreBadgeBg = this.add.graphics().setDepth(50);
    this.drawScoreBadge(W / 2, badgeY, '0');

    this.scoreText = this.add.text(W / 2, badgeY, '0', {
      fontFamily: DISPLAY_FONT,
      fontSize: '54px',
      color: HEX.white,
    }).setOrigin(0.5, 0.5).setDepth(52);
    this.scoreText.setStroke(HEX.ink, 4);

    const gs = this.scene.get('Game');
    gs.events.on('ui:score', (v) => {
      this.scoreText.setText(String(v));
      this.drawScoreBadge(W / 2, badgeY, String(v));
      // little pop on score
      this.tweens.add({
        targets: this.scoreText,
        scale: { from: 1.18, to: 1 },
        duration: 220,
        ease: 'Back.Out',
      });
    });
    gs.events.on('ui:reset', () => {
      this.scoreText.setText('0');
      this.drawScoreBadge(W / 2, badgeY, '0');
      this.hideGameOver();
    });

    this.events.once('shutdown', () => {
      gs.events.removeAllListeners('ui:score');
      gs.events.removeAllListeners('ui:reset');
    });
  }

  // Re-draws the pill so it grows with the digit count
  drawScoreBadge(cx, cy, text){
    const g = this.scoreBadgeBg;
    g.clear();
    const w = Math.max(96, 36 + text.length * 36);
    const h = 64;
    const x = cx - w / 2;
    const y = cy - h / 2;

    // Offset shadow
    g.fillStyle(C.ink, 1);
    g.fillRoundedRect(x + 4, y + 4, w, h, 18);

    // Outline
    g.fillStyle(C.ink, 1);
    g.fillRoundedRect(x - 4, y - 4, w + 8, h + 8, 22);

    // Pill body
    g.fillStyle(C.pink, 1);
    g.fillRoundedRect(x, y, w, h, 18);

    // Inner highlight (top half slightly lighter for cartoon depth)
    g.fillStyle(0xFF6BA8, 0.55);
    g.fillRoundedRect(x + 4, y + 4, w - 8, h * 0.4, 14);
  }

  // ============================================================
  // Game over modal
  // ============================================================
  showGameOver({ score }){
    this.hideGameOver(); // safety: clear any stale panel first

    // Record the score immediately — don't wait for the user to click
    // a button. The React layer persists it to localStorage and surfaces
    // it on the home/landing screens.
    window.dispatchEvent(new CustomEvent('printr:score-update', {
      detail: { score },
    }));

    const { width: W, height: H } = this.scale;
    this.goGroup = this.add.group();

    // Soft ink overlay (not pitch black — keeps cream warmth visible)
    const overlay = this.add.rectangle(0, 0, W, H, C.ink, 0.55)
      .setOrigin(0).setDepth(200);
    overlay.setInteractive();
    this.goGroup.add(overlay);

    // ----- Cream card with offset shadow -----
    const cardW = Math.min(W - 40, 380);
    const cardH = 440;
    const cardX = W / 2 - cardW / 2;
    const cardY = H / 2 - cardH / 2;

    const cardShadow = this.add.graphics().setDepth(201);
    cardShadow.fillStyle(C.ink, 1);
    cardShadow.fillRoundedRect(cardX + 8, cardY + 8, cardW, cardH, 24);
    this.goGroup.add(cardShadow);

    const cardOutline = this.add.graphics().setDepth(202);
    cardOutline.fillStyle(C.ink, 1);
    cardOutline.fillRoundedRect(cardX - 4, cardY - 4, cardW + 8, cardH + 8, 28);
    this.goGroup.add(cardOutline);

    const card = this.add.graphics().setDepth(203);
    card.fillStyle(C.paper, 1);
    card.fillRoundedRect(cardX, cardY, cardW, cardH, 24);
    this.goGroup.add(card);

    // ----- "GAME OVER" title -----
    const titleY = cardY + 56;
    const titleGame = this.add.text(W / 2 - 78, titleY, 'GAME', {
      fontFamily: DISPLAY_FONT,
      fontSize: '40px',
      color: HEX.ink,
    }).setOrigin(0.5).setDepth(204);
    titleGame.setShadow(3, 3, HEX.yellow, 0, false, false);
    this.goGroup.add(titleGame);

    const titleOver = this.add.text(W / 2 + 78, titleY, 'OVER', {
      fontFamily: DISPLAY_FONT,
      fontSize: '40px',
      color: HEX.pink,
    }).setOrigin(0.5).setDepth(204);
    titleOver.setShadow(3, 3, HEX.ink, 0, false, false);
    this.goGroup.add(titleOver);

    // ----- Yellow score disk -----
    const diskY = cardY + 200;
    const diskR = 78;
    const diskShadow = this.add.graphics().setDepth(204);
    diskShadow.fillStyle(C.ink, 1);
    diskShadow.fillCircle(W / 2 + 5, diskY + 5, diskR);
    this.goGroup.add(diskShadow);

    const diskOutline = this.add.graphics().setDepth(205);
    diskOutline.fillStyle(C.ink, 1);
    diskOutline.fillCircle(W / 2, diskY, diskR + 4);
    this.goGroup.add(diskOutline);

    const disk = this.add.graphics().setDepth(206);
    disk.fillStyle(C.yellow, 1);
    disk.fillCircle(W / 2, diskY, diskR);
    this.goGroup.add(disk);

    const scoreLabel = this.add.text(W / 2, diskY - 30, 'SCORE', {
      fontFamily: BODY_FONT,
      fontSize: '11px',
      fontStyle: 'bold',
      color: HEX.ink,
    }).setOrigin(0.5).setLetterSpacing(3).setDepth(207);
    this.goGroup.add(scoreLabel);

    const scoreNum = this.add.text(W / 2, diskY + 6, String(score), {
      fontFamily: DISPLAY_FONT,
      fontSize: '60px',
      color: HEX.ink,
    }).setOrigin(0.5).setDepth(207);
    this.goGroup.add(scoreNum);

    // ----- PLAY AGAIN (big pink chunky button) -----
    this.makeChunkyButton(
      W / 2, cardY + cardH - 110,
      cardW - 60, 56,
      'PLAY AGAIN',
      C.pink, HEX.white,
      () => {
        const gs = this.scene.get('Game');
        this.hideGameOver();
        gs.resetForNewRun();
      },
    );

    // ----- GO TO HOME (secondary text link) -----
    const homeBtn = this.add.text(W / 2, cardY + cardH - 50, '← GO TO HOME', {
      fontFamily: DISPLAY_FONT,
      fontSize: '18px',
      color: HEX.ink,
    }).setOrigin(0.5).setDepth(207).setInteractive({ useHandCursor: true });
    homeBtn.on('pointerup', () => {
      window.dispatchEvent(new CustomEvent('printr:return-home', {
        detail: { score },
      }));
      this.hideGameOver();
    });
    homeBtn.on('pointerover', () => homeBtn.setColor(HEX.pink));
    homeBtn.on('pointerout',  () => homeBtn.setColor(HEX.ink));
    this.goGroup.add(homeBtn);
  }

  hideGameOver(){
    if (this.goGroup) {
      this.goGroup.clear(true, true);
      this.goGroup = null;
    }
  }

  // Chunky cartoon button: ink shadow + ink outline + colored fill + label.
  makeChunkyButton(cx, cy, w, h, label, fillColor, labelHex, onClick){
    const x = cx - w / 2;
    const y = cy - h / 2;

    // shadow
    const shadow = this.add.graphics().setDepth(206);
    shadow.fillStyle(C.ink, 1);
    shadow.fillRoundedRect(x + 5, y + 5, w, h, h / 2);
    this.goGroup.add(shadow);

    // outline
    const outline = this.add.graphics().setDepth(207);
    outline.fillStyle(C.ink, 1);
    outline.fillRoundedRect(x - 4, y - 4, w + 8, h + 8, h / 2 + 4);
    this.goGroup.add(outline);

    // fill
    const fill = this.add.graphics().setDepth(208);
    fill.fillStyle(fillColor, 1);
    fill.fillRoundedRect(x, y, w, h, h / 2);
    this.goGroup.add(fill);

    // label
    const t = this.add.text(cx, cy, label, {
      fontFamily: DISPLAY_FONT,
      fontSize: '24px',
      color: labelHex,
    }).setOrigin(0.5).setLetterSpacing(1).setDepth(209);
    this.goGroup.add(t);

    // hit area (last so it's on top)
    const hit = this.add.rectangle(cx, cy, w + 16, h + 16, 0xffffff, 0.001)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(210);
    this.goGroup.add(hit);

    hit.on('pointerup', onClick);
    hit.on('pointerover', () => { t.setScale(1.05); });
    hit.on('pointerout',  () => { t.setScale(1); });
  }
}
