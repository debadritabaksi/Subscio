"use client";
import { useEffect, useRef } from "react";
import { useCardPopSound } from "@/utils/useSoundEffect";


export default function CursorRippleCanvas() {
  useCardPopSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{x: number, y: number}[]>(Array.from({ length: 25 }, () => ({ x: -1000, y: -1000 })));
  const mouseRef = useRef<{x: number, y: number}>({ x: -1000, y: -1000 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest('.card-interactive-pop, .glass-panel, [role="button"], button, a, .z-20')) {
        mouseRef.current = { x: -1000, y: -1000 };
        trailRef.current.forEach(p => { p.x = -1000; p.y = -1000; });
        return;
      }
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const trail = trailRef.current;
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      trail.forEach((point) => {
        point.x += (targetX - point.x) * 0.35;
        point.y += (targetY - point.y) * 0.35;
        targetX = point.x;
        targetY = point.y;
      });
      
      if (trail[0].x > -500) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length - 1; i++) {
          const xc = (trail[i].x + trail[i + 1].x) / 2;
          const yc = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        }
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
        
        ctx.strokeStyle = "rgba(202, 156, 104, 0.6)";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(202, 156, 104, 0.9)";
        ctx.stroke();
      }

      ctx.shadowBlur = 0; // reset shadow
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
