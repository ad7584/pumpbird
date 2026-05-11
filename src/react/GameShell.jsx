// ============================================================
// GameShell — owns the DOM node Phaser mounts into.
// We defer Phaser boot to the next animation frame so React's
// layout has settled before Phaser measures the container.
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { bootPhaser } from '../phaser/bootstrap.js';

export default function GameShell() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Two RAFs: first one = layout calc, second one = paint complete.
    // Phaser then mounts into a fully-positioned, fully-sized container.
    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => setReady(true));
      raf1 = raf2;
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;
    if (gameRef.current) return; // guard against double-boot
    gameRef.current = bootPhaser(containerRef.current);
    return () => {
      try { gameRef.current?.destroy?.(true); } catch {}
      gameRef.current = null;
    };
  }, [ready]);

  return <div id="game" ref={containerRef} />;
}