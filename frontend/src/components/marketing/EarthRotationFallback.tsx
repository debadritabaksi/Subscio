"use client";

import { useEffect, useRef } from "react";

// Earth night-side texture coordinates (simplified 4K world map projection)
// These would normally be loaded from an image, but we simulate with procedural generation
const EARTH_TEXTURE_WIDTH = 3840;
const EARTH_TEXTURE_HEIGHT = 1920;

export default function EarthRotationFallback() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let dx = 0; // Horizontal offset for seamless looping

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    // Generate Earth night texture procedurally
    const generateEarthTexture = (offset: number) => {
      const width = canvas!.width;
      const height = canvas!.height;

      // Clear with deep space background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#02040A");
      gradient.addColorStop(0.5, "#050810");
      gradient.addColorStop(1, "#02040A");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Earth sphere (night side view)
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      // Clip to Earth circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Draw city lights (bright points on dark earth)
      const cityLights = [
        // North America
        { x: 0.22, y: 0.35, intensity: 0.9 },
        { x: 0.20, y: 0.40, intensity: 0.7 },
        { x: 0.28, y: 0.38, intensity: 0.8 },
        { x: 0.25, y: 0.42, intensity: 0.6 },
        { x: 0.30, y: 0.45, intensity: 0.5 },

        // South America
        { x: 0.32, y: 0.55, intensity: 0.8 },
        { x: 0.30, y: 0.52, intensity: 0.6 },
        { x: 0.34, y: 0.58, intensity: 0.7 },

        // Europe
        { x: 0.52, y: 0.32, intensity: 0.9 },
        { x: 0.54, y: 0.35, intensity: 0.8 },
        { x: 0.50, y: 0.30, intensity: 0.7 },
        { x: 0.56, y: 0.33, intensity: 0.85 },

        // Africa
        { x: 0.50, y: 0.45, intensity: 0.6 },
        { x: 0.48, y: 0.48, intensity: 0.5 },
        { x: 0.52, y: 0.50, intensity: 0.7 },

        // Asia
        { x: 0.62, y: 0.35, intensity: 0.9 },
        { x: 0.65, y: 0.38, intensity: 0.8 },
        { x: 0.70, y: 0.36, intensity: 0.85 },
        { x: 0.68, y: 0.40, intensity: 0.7 },
        { x: 0.72, y: 0.42, intensity: 0.6 },

        // Southeast Asia / Australia
        { x: 0.75, y: 0.55, intensity: 0.7 },
        { x: 0.78, y: 0.58, intensity: 0.6 },
        { x: 0.80, y: 0.60, intensity: 0.5 },

        // Japan / Korea
        { x: 0.73, y: 0.32, intensity: 0.95 },
        { x: 0.74, y: 0.34, intensity: 0.85 },

        // Middle East
        { x: 0.58, y: 0.42, intensity: 0.7 },
        { x: 0.56, y: 0.44, intensity: 0.6 },
      ];

      // Draw city glow points
      cityLights.forEach((city) => {
        const x = centerX + (city.x - 0.5) * radius * 1.4 + offset * 0.1;
        const y = centerY + (city.y - 0.5) * radius * 1.4;
        const glowRadius = 8 + city.intensity * 15;

        const cityGlow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        cityGlow.addColorStop(0, `rgba(255, 200, 100, ${city.intensity * 0.9})`);
        cityGlow.addColorStop(0.3, `rgba(255, 180, 80, ${city.intensity * 0.4})`);
        cityGlow.addColorStop(1, "rgba(255, 150, 50, 0)");

        ctx.fillStyle = cityGlow;
        ctx.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
      });

      // Draw subtle atmospheric glow around Earth
      const atmosGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.85,
        centerX, centerY, radius * 1.1
      );
      atmosGradient.addColorStop(0, "rgba(100, 150, 200, 0.05)");
      atmosGradient.addColorStop(0.5, "rgba(50, 100, 150, 0.03)");
      atmosGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = atmosGradient;
      ctx.fillRect(centerX - radius * 1.1, centerY - radius * 1.1, radius * 2.2, radius * 2.2);

      ctx.restore();

      // Stars in background (outside Earth)
      ctx.save();
      for (let i = 0; i < 200; i++) {
        const starX = (i * 137.5 + offset * 0.02) % width;
        const starY = (i * 97.3) % height;
        const starSize = 0.5 + (i % 3) * 0.5;
        const starAlpha = 0.3 + (i % 5) * 0.15;

        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const render = () => {
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      // Smooth seamless shift
      dx += 0.2;
      if (dx > EARTH_TEXTURE_WIDTH) {
        dx = 0;
      }

      generateEarthTexture(dx);
      animationId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      style={{ display: "block" }}
    />
  );
}
