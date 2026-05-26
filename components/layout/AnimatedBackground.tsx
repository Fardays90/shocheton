"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const blob4Ref = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMouseActive = false;
    let targetCursorOp = 0;
    let currentCursorOp = 0;

    // Define the auto-drifting configuration for 4 blobs
    const blobs = [
      { ref: blob1Ref, cx: 0.3, cy: 0.3, rx: 0.3, ry: 0.2, speed: 0.0004, phase: 0 },
      { ref: blob2Ref, cx: 0.7, cy: 0.7, rx: 0.2, ry: 0.3, speed: 0.0003, phase: 2 },
      { ref: blob3Ref, cx: 0.2, cy: 0.8, rx: 0.4, ry: 0.2, speed: 0.0002, phase: 4 },
      { ref: blob4Ref, cx: 0.8, cy: 0.2, rx: 0.2, ry: 0.4, speed: 0.0005, phase: 1 },
    ];

    // Initialize current positions for lerping
    const positions = blobs.map((b) => ({
      x: window.innerWidth * b.cx,
      y: window.innerHeight * b.cy,
    }));
    const cursorPos = { x: mouseX, y: mouseY };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseActive = true;
      targetCursorOp = 1;
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
      targetCursorOp = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 1. Update cursor glow (sharp spotlight) via lerp
      cursorPos.x += (mouseX - cursorPos.x) * 0.15;
      cursorPos.y += (mouseY - cursorPos.y) * 0.15;
      currentCursorOp += (targetCursorOp - currentCursorOp) * 0.1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(calc(${cursorPos.x}px - 50%), calc(${cursorPos.y}px - 50%), 0)`;
        cursorRef.current.style.opacity = currentCursorOp.toString();
      }

      // 2. Update the 4 large background blobs
      blobs.forEach((blob, i) => {
        // Compute base drifting position using Lissajous curves (sine/cosine)
        const baseX = w * blob.cx + Math.sin(time * blob.speed + blob.phase) * (w * blob.rx);
        const baseY = h * blob.cy + Math.cos(time * blob.speed * 0.8 + blob.phase) * (h * blob.ry);

        let targetX = baseX;
        let targetY = baseY;

        // Apply magnetic pull toward the cursor if mouse is within window
        if (isMouseActive) {
          const dx = mouseX - baseX;
          const dy = mouseY - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const magneticRadius = w * 0.5; // pull range based on screen width

          if (dist < magneticRadius) {
            // Smooth falloff based on distance
            const pullStrength = Math.pow(1 - dist / magneticRadius, 2) * 0.6;
            targetX = baseX + dx * pullStrength;
            targetY = baseY + dy * pullStrength;
          }
        }

        // Fluid lerp towards target position to prevent snapping
        positions[i].x += (targetX - positions[i].x) * 0.04;
        positions[i].y += (targetY - positions[i].y) * 0.04;

        if (blob.ref.current) {
          blob.ref.current.style.transform = `translate3d(calc(${positions[i].x}px - 50%), calc(${positions[i].y}px - 50%), 0)`;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  // SVG Noise embedded as Data URI for high-performance grain overlay
  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500"
      aria-hidden="true"
    >
      {/* Texture Layer: Animated Noise Grain */}
      <div
        className="absolute inset-0 z-10 opacity-[0.25] mix-blend-overlay"
        style={{ backgroundImage: noiseSvg }}
      />

      {/* Reduced Motion Fallback */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-cyan-800/10 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-950/20" />
      )}

      {/* High-Performance Flowing Blobs layer */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 w-full h-full mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-40">
          <div
            ref={blob1Ref}
            className="absolute top-0 left-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-emerald-400 dark:bg-emerald-600 blur-[80px] sm:blur-[120px]"
            style={{ willChange: "transform", transform: "translate3d(-9999px, -9999px, 0)" }}
          />
          <div
            ref={blob2Ref}
            className="absolute top-0 left-0 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full bg-teal-400 dark:bg-teal-600 blur-[80px] sm:blur-[120px]"
            style={{ willChange: "transform", transform: "translate3d(-9999px, -9999px, 0)" }}
          />
          <div
            ref={blob3Ref}
            className="absolute top-0 left-0 w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full bg-cyan-400 dark:bg-cyan-700 blur-[80px] sm:blur-[120px]"
            style={{ willChange: "transform", transform: "translate3d(-9999px, -9999px, 0)" }}
          />
          <div
            ref={blob4Ref}
            className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-green-500 dark:bg-green-800 blur-[80px] sm:blur-[120px]"
            style={{ willChange: "transform", transform: "translate3d(-9999px, -9999px, 0)" }}
          />
        </div>
      )}

      {/* Sharp Radial Glow tracking the exact cursor position */}
      {!prefersReducedMotion && (
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 w-[200px] h-[200px] rounded-full bg-green-400/50 dark:bg-green-300/20 blur-[25px] z-20 mix-blend-screen"
          style={{
            willChange: "transform, opacity",
            opacity: 0,
            transform: "translate3d(-9999px, -9999px, 0)",
          }}
        />
      )}
    </div>
  );
}
