"use client";

import { useEffect, useRef, useState } from "react";

interface RollingNumberProps {
  target: number;
  decimals?: number;
  className?: string;
}

export default function RollingNumber({ target, decimals = 0, className = "" }: RollingNumberProps) {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const startTime = performance.now();

            function updateNumber(now: number) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = progress * (2 - progress); // ease-out quad
              const current = easeProgress * target;
              
              setValue(current);
              
              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              } else {
                setValue(target);
              }
            }
            
            requestAnimationFrame(updateNumber);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [target]);

  return (
    <span ref={elementRef} className={`rolling-number ${className}`}>
      {value.toFixed(decimals)}
    </span>
  );
}
