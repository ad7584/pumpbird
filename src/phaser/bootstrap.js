// ============================================================
// Phaser bootstrap — boots the game directly into the gameplay scene.
// React owns the home page; Phaser only handles in-game rendering.
// Flow: Boot → Preload → Game (+ UI launched in parallel)
// ============================================================
import Phaser from 'phaser';
import BootScene from '../scenes/BootScene.js';
import PreloadScene from '../scenes/PreloadScene.js';
import GameScene from '../scenes/GameScene.js';
import UIScene from '../scenes/UIScene.js';
import { GAME } from '../../config.js';

export function bootPhaser(parent) {
  const config = {
    type: Phaser.AUTO,
    parent,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
    backgroundColor: GAME.BG_COLOR,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    fps: { target: 60, forceSetTimeOut: true },
    scene: [BootScene, PreloadScene, GameScene, UIScene],
  };

  return new Phaser.Game(config);
}