import { useEffect, useRef } from "react";

/**
 * CursorEffects — gold luxury cursor system.
 * Disabled automatically on touch devices (pointer: coarse) and
 * when prefers-reduced-motion is set.
 */
export default function CursorEffects() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: coarse pointer (touch) or reduced-motion
    const isCoarse  = window.matchMedia("(pointer: coarse)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || isReduced) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    const spot = spotRef.current!;

    // Force cursor none on the whole document via JS (more reliable than CSS alone)
    const styleTag = document.createElement("style");
    styleTag.id = "cursor-override";
    styleTag.textContent = `
      *, *::before, *::after { cursor: none !important; }
      input, textarea, select { cursor: text !important; }
    `;
    document.head.appendChild(styleTag);

    // Start elements off-screen so they don't flash at (0,0)
    const OFFSCREEN = "translate(-9999px, -9999px)";
    dot.style.transform  = OFFSCREEN;
    ring.style.transform = OFFSCREEN;
    spot.style.transform = OFFSCREEN;
    dot.style.visibility  = "visible";
    ring.style.visibility = "visible";
    spot.style.visibility = "visible";

    let mx = -9999, my = -9999;
    let rx = mx,   ry = my;
    let rafId: number;

    // ── Dot: instant ────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      spot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    };

    // ── Ring: lerp ───────────────────────────────────────────────────────────
    const tick = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── Hover states ─────────────────────────────────────────────────────────
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      const isView  = !!t.closest("[data-cursor='view']");
      const isLink  = !!t.closest("a, button, [role='button']");
      const isInput = !!t.closest("input, textarea, select");

      ring.classList.toggle("ring-view",  isView);
      ring.classList.toggle("ring-hover", isView || isLink);
      dot.style.opacity = isInput ? "0" : "1";
    };

    // ── Card tilt + inner glow ───────────────────────────────────────────────
    const tiltCleanup: (() => void)[] = [];

    const setupTilt = () => {
      document.querySelectorAll<HTMLElement>(".glass-card").forEach(card => {
        const move = (e: PointerEvent) => {
          const r  = card.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
          const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
          card.style.transform = `perspective(900px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) translateY(-3px)`;
          card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width)  * 100}%`);
          card.style.setProperty("--my", `${((e.clientY - r.top)  / r.height) * 100}%`);
        };
        const leave = () => {
          card.style.transform = "";
          card.style.removeProperty("--mx");
          card.style.removeProperty("--my");
        };
        card.addEventListener("pointermove",  move,  { passive: true });
        card.addEventListener("pointerleave", leave);
        tiltCleanup.push(() => {
          card.removeEventListener("pointermove",  move  as EventListener);
          card.removeEventListener("pointerleave", leave as EventListener);
        });
      });
    };

    // ── Magnetic buttons ─────────────────────────────────────────────────────
    const magnetCleanup: (() => void)[] = [];

    const setupMagnetic = () => {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach(btn => {
        const move = (e: PointerEvent) => {
          const r    = btn.getBoundingClientRect();
          const cx   = r.left + r.width  / 2;
          const cy   = r.top  + r.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          if (dist < 80) {
            const pull = (80 - dist) / 80;
            btn.style.transform = `translate(${((e.clientX - cx) / dist) * pull * 10}px, ${((e.clientY - cy) / dist) * pull * 10}px)`;
          } else {
            btn.style.transform = "";
          }
        };
        const leave = () => {
          btn.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1)";
          btn.style.transform  = "";
          setTimeout(() => { btn.style.transition = ""; }, 400);
        };
        window.addEventListener("pointermove",  move,  { passive: true });
        btn.addEventListener(   "pointerleave", leave);
        magnetCleanup.push(() => {
          window.removeEventListener("pointermove",  move  as EventListener);
          btn.removeEventListener(   "pointerleave", leave as EventListener);
        });
      });
    };

    // ── Click ripple ─────────────────────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      const r = document.createElement("div");
      r.className = "cursor-ripple";
      r.style.left = `${e.clientX}px`;
      r.style.top  = `${e.clientY}px`;
      document.body.appendChild(r);
      r.addEventListener("animationend", () => r.remove(), { once: true });
    };

    // ── Particle trail ───────────────────────────────────────────────────────
    const TRAIL = 9;
    const particles = Array.from({ length: TRAIL }, () => {
      const p = document.createElement("div");
      p.className = "cursor-particle";
      p.style.opacity   = "0";
      p.style.transform = OFFSCREEN;
      document.body.appendChild(p);
      return p;
    });
    const history: { x: number; y: number }[] = [];

    const onMoveTrail = (e: MouseEvent) => {
      history.unshift({ x: e.clientX, y: e.clientY });
      if (history.length > TRAIL * 3) history.pop();
      particles.forEach((p, i) => {
        const pos = history[i * 2] || history[0];
        if (pos) {
          p.style.transform = `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%))`;
          p.style.opacity   = `${((TRAIL - i) / TRAIL) * 0.32}`;
        }
      });
    };

    // Defer DOM queries for cards/buttons until layout settles
    const t1 = setTimeout(setupTilt,     800);
    const t2 = setTimeout(setupMagnetic, 800);

    window.addEventListener("mousemove", onMove,      { passive: true });
    window.addEventListener("mousemove", onMoveTrail, { passive: true });
    window.addEventListener("mouseover", onOver,      { passive: true });
    window.addEventListener("click",     onClick);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(rafId);
      styleTag.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onMoveTrail);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("click",     onClick);
      tiltCleanup.forEach(fn => fn());
      magnetCleanup.forEach(fn => fn());
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <>
      {/* Spotlight behind all content */}
      <div id="cursor-spotlight" ref={spotRef} style={{ visibility: "hidden" }} />
      {/* Gold dot */}
      <div id="cursor-dot"  ref={dotRef}  style={{ visibility: "hidden" }} />
      {/* Gold ring */}
      <div id="cursor-ring" ref={ringRef} style={{ visibility: "hidden" }}>
        <span className="ring-label">View</span>
      </div>
    </>
  );
}
