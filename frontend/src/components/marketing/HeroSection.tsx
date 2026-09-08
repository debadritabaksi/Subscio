"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("subscio_auth") === "true");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let telemetryTimeout: ReturnType<typeof setTimeout> | null = null;
    const startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Clear any pending telemetry
    const clearTelemetry = () => {
      if (telemetryTimeout) {
        clearTimeout(telemetryTimeout);
        telemetryTimeout = null;
      }
    };

    // Telemetry ping display state
    const telemetryPings: { text: string; y: number; startTime: number }[] = [];

    // Schedule a telemetry ping
    const scheduleTelemetry = (yBase: number, yOffset: number) => {
      clearTelemetry();
      
      const pings = [
        { text: "0.02s · Series B $40M · EMPANELMENT ACTIVE", delay: 0 },
        { text: "0.05s · GeM RFP 4,000 Units · DETECTED", delay: 400 },
      ];

      pings.forEach((pingData, idx) => {
        const timeoutId = setTimeout(() => {
          telemetryPings.push({
            text: pingData.text,
            y: yBase - 40 - yOffset + (idx * 18),
            startTime: performance.now(),
          });
        }, pingData.delay);
        telemetryTimeout = timeoutId;
      });
    };

    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Tactical Pulse configuration
      const pulseInterval = 2500; // 2.5 seconds
      const elapsed = (now - startTime) / 1000;
      const pulsePhase = (elapsed * 1000) % pulseInterval;
      const pulseProgress = pulsePhase / pulseInterval; // 0 to 1

      // Radar reticle center position (over the horizon hub)
      const bx = width * 0.52;
      const by = height * 0.45;

      // ── Radar Reticle ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(bx, by, 60, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(216, 178, 110, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();

      // Crosshairs
      const reticleTick = 15;
      ctx.strokeStyle = "rgba(216, 178, 110, 0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(bx - reticleTick - 60, by);
      ctx.lineTo(bx - 60, by);
      ctx.moveTo(bx + 60, by);
      ctx.lineTo(bx + reticleTick + 60, by);
      ctx.moveTo(bx, by - reticleTick - 60);
      ctx.lineTo(bx, by - 60);
      ctx.moveTo(bx, by + 60);
      ctx.lineTo(bx, by + reticleTick + 60);
      ctx.stroke();
      ctx.restore();

      // ── Tactical Pulse Ring (expands every 2.5 seconds) ──
      if (pulseProgress < 1) {
        const pulseRadius = 15 + pulseProgress * 180;
        const pulseAlpha = Math.max(0, (1 - pulseProgress) * 0.6);
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(bx, by, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(216, 178, 110, ${pulseAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // ── Telemetry Pings (fading upward) ──
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      telemetryPings.forEach((ping) => {
        const pingElapsed = (now - ping.startTime) / 1000;
        const pingLife = 3; // seconds
        const pingProgress = Math.min(pingElapsed / pingLife, 1);
        
        if (pingProgress < 1) {
          const alpha = Math.max(0, 1 - pingProgress) * 0.8;
          const yOffset = pingProgress * 20;
          
          ctx.fillStyle = `rgba(216, 178, 110, ${alpha})`;
          ctx.fillText(ping.text, bx + 70, ping.y - yOffset);
        }
      });

      // Schedule new telemetry pings every 2.5 seconds
      if (pulsePhase < 100 && pulsePhase > 99) {
        scheduleTelemetry(by, 0);
      }

      // ── Horizon atmospheric glow (faint) ──
      const horizonGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 100);
      horizonGlow.addColorStop(0, "rgba(216, 178, 110, 0.15)");
      horizonGlow.addColorStop(0.5, "rgba(216, 178, 110, 0.05)");
      horizonGlow.addColorStop(1, "rgba(216, 178, 110, 0)");
      ctx.fillStyle = horizonGlow;
      ctx.beginPath();
      ctx.arc(bx, by, 100, 0, Math.PI * 2);
      ctx.fill();

      // ── HUD Status Badge ──
      ctx.save();
      ctx.font = "bold 9px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "#D8B26E";
      ctx.fillText("TACTICAL PULSE :: ACTIVE", bx + 18, by - 30);
      ctx.fillStyle = "rgba(248, 250, 252, 0.65)";
      ctx.font = "8px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText("AUTONOMOUS SURVEILLANCE MODE", bx + 18, by - 18);
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
      clearTelemetry();
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden min-h-[85vh] border-b border-white/10 flex items-center bg-transparent">
      {/* Video Earth Rotation Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-20"
      >
        <source src="/assets/earth-orbit-loop.webm" type="video/webm" />
        <source src="/assets/earth-orbit-loop.mp4" type="video/mp4" />
      </video>

      {/* Canvas Fallback for Earth Rotation if video not available */}
      <canvas
        id="earth-rotation-fallback"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-15"
        style={{ display: "none" }}
      />

      {/* Contrast Scrim - Bottom-Left Vignette for CTA Area */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse_at_bottom_left, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.6) 35%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center px-8 py-16 md:py-20 max-w-7xl mx-auto gap-12 w-full bg-transparent">
        {/* Hero Left Content */}
        <div className="flex-1 space-y-6 bg-transparent relative">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#D8B26E]/30 bg-[#D8B26E]/10 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(216,178,110,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#D8B26E] animate-pulse shadow-[0_0_8px_rgba(216,178,110,0.8)]" />
            <span className="text-[11px] font-mono font-extrabold text-[#D8B26E] uppercase tracking-[0.22em]">
              Autonomous Tactical Intelligence
            </span>
          </div>

          {/* Brand Text - Champagne-Gold Metallic Gradient */}
          <div className="space-y-1 pt-1">
            <h1 className="text-6xl md:text-8xl bg-[length:auto_100%] bg-[linear-gradient(180deg,#FFF1D0_0%,#D8B26E_60%,#8E6B2D_100%)] bg-clip-text text-transparent font-extrabold tracking-tight uppercase leading-none drop-shadow-[0_4px_28px_rgba(216,178,110,0.25)]">
              SUBSCIO
            </h1>
            <p className="text-xs font-mono text-[#D8B26E]/80 tracking-[0.3em] uppercase pt-2">
              Enterprise Revenue Infrastructure
            </p>
          </div>

          {/* Headline - Champagne-Gold Gradient */}
          <h2 className="text-3xl md:text-5xl font-bold leading-snug tracking-tight pt-2">
            Turn Global{" "}
            <span className="bg-[length:auto_100%] bg-[linear-gradient(180deg,#FFF1D0_0%,#D8B26E_60%,#8E6B2D_100%)] bg-clip-text text-transparent font-extrabold">
              Internet Noise
            </span>{" "}
            Into High-Intent B2B Revenue.
          </h2>

          <p className="text-[15px] md:text-[16px] text-pearl/80 max-w-xl leading-relaxed font-sans">
            Deploy autonomous AI agents that intercept, synthesize, and score raw
            market signals across GitHub, live RSS feeds, and the open web —
            delivering verified intent and warm executive pitches directly to your
            pipeline.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="btn-metallic-champagne px-8 py-4 text-[11px] uppercase tracking-widest text-center"
              >
                RETURN TO DASHBOARD
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="btn-metallic-champagne px-8 py-4 text-[11px] uppercase tracking-widest text-center"
                >
                  REGISTER WORKSPACE
                </Link>
                <Link
                  href="/login"
                  className="btn-signin-glass px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-center"
                >
                  SIGN IN
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Right: Tactical Pulse Matrix Canvas */}
        <div className="w-full max-w-2xl bg-transparent">
          <canvas
            id="tactical-pulse-canvas"
            ref={canvasRef}
            className="w-full h-[420px] md:h-[520px] bg-transparent"
          />
        </div>
      </div>
    </section>
  );
}
