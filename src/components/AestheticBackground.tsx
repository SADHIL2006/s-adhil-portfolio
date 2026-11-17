import { useEffect, useRef } from "react";

/**
 * AestheticBackground — full-page canvas with:
 *   • Drifting aurora/nebula blobs (dark gold + amber tones)
 *   • Floating gold star particles
 *   • Faint noise grain overlay via SVG filter
 *   • Subtle diagonal light beam
 * Runs on requestAnimationFrame; paused automatically when hidden.
 */
export default function AestheticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    let   raf: number;
    let   W = 0, H = 0;

    // ── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Aurora blobs ─────────────────────────────────────────────────────────
    interface Blob {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      color: string;
      phase: number;
      speed: number;
    }

    const BLOB_COLORS = [
      "rgba(168,130, 58, 0.18)",   // deep gold
      "rgba(231,200,130, 0.13)",   // bright gold
      "rgba(100, 70, 20, 0.22)",   // amber
      "rgba(180,140, 60, 0.14)",   // mid gold
      "rgba( 60, 40, 10, 0.25)",   // dark amber
      "rgba(231,200,130, 0.09)",   // pale gold
    ];

    const blobs: Blob[] = Array.from({ length: 7 }, (_, i) => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    (Math.random() - 0.5) * 0.18,
      r:     220 + Math.random() * 320,
      color: BLOB_COLORS[i % BLOB_COLORS.length],
      phase: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0006,
    }));

    // ── Star particles ───────────────────────────────────────────────────────
    interface Star {
      x: number; y: number;
      size: number;
      alpha: number;
      speed: number;
      phase: number;
    }

    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      size:  0.4 + Math.random() * 1.1,
      alpha: 0.08 + Math.random() * 0.28,
      speed: 0.0008 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Diagonal beam ────────────────────────────────────────────────────────
    const drawBeam = (t: number) => {
      const pulse = 0.025 + 0.012 * Math.sin(t * 0.0003);
      const grad  = ctx.createLinearGradient(W * 0.0, H * 0.0, W * 0.6, H * 0.9);
      grad.addColorStop(0,   `rgba(231,200,130,0)`);
      grad.addColorStop(0.3, `rgba(231,200,130,${pulse})`);
      grad.addColorStop(0.5, `rgba(168,130, 58,${pulse * 0.5})`);
      grad.addColorStop(1,   `rgba(231,200,130,0)`);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      // Narrow diagonal beam
      ctx.beginPath();
      ctx.moveTo(-100, 0);
      ctx.lineTo(W * 0.65, 0);
      ctx.lineTo(W * 0.65 + 180, H);
      ctx.lineTo(-100 + 180, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    // ── Main draw loop ───────────────────────────────────────────────────────
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      // Deep base gradient
      const bg = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.9);
      bg.addColorStop(0,   "#120e07");
      bg.addColorStop(0.5, "#0a0804");
      bg.addColorStop(1,   "#050401");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Aurora blobs
      blobs.forEach(b => {
        // Breathe
        b.phase += b.speed;
        const br = b.r * (0.88 + 0.12 * Math.sin(b.phase));
        b.x += b.vx; b.y += b.vy;
        // Bounce
        if (b.x < -br)      { b.x = W + br;  }
        if (b.x > W + br)   { b.x = -br;     }
        if (b.y < -br)      { b.y = H + br;  }
        if (b.y > H + br)   { b.y = -br;     }

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, br);
        g.addColorStop(0,   b.color);
        g.addColorStop(0.4, b.color.replace(/[\d.]+\)$/, v => `${parseFloat(v) * 0.5})`));
        g.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, br, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";
      drawBeam(t);

      // Stars
      ctx.globalCompositeOperation = "lighter";
      stars.forEach(s => {
        s.phase += s.speed;
        const a = s.alpha * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231,200,130,${a})`;
        ctx.fill();
      });

      ctx.globalCompositeOperation = "source-over";

      // Vignette — dark edges
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, Math.max(W, H) * 0.80);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.60)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
