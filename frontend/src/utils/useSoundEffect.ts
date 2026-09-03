"use client";
import { useCallback, useEffect, useRef } from "react";

export const useCardPopSound = () => {
  const activeCardRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const popSound = new window.Audio('/sounds/pop.mp3');
    popSound.volume = 0.2;
    popSound.preload = 'auto';

    const unlockAudio = () => {
      popSound.play().then(() => popSound.pause()).catch(() => {});
    };
    window.addEventListener('click', unlockAudio, { once: true, capture: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, capture: true });

    const handlePointerOver = (e: PointerEvent) => {
      const card = (e.target as HTMLElement)?.closest('.card-interactive-pop, .glass-panel, [role="button"], button, a');
      if (!card || card === activeCardRef.current) return;
      
      activeCardRef.current = card;
      
      const clone = popSound.cloneNode() as HTMLAudioElement;
      clone.volume = 0.2;
      clone.play().catch(e => console.log('Audio blocked:', e));
    };
    
    const handlePointerOut = (e: PointerEvent) => {
      if (activeCardRef.current && !(activeCardRef.current as HTMLElement).contains(e.relatedTarget as Node)) {
        activeCardRef.current = null;
      }
    };
    
    document.body.addEventListener("pointerover", handlePointerOver);
    document.body.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.body.removeEventListener("pointerover", handlePointerOver);
      document.body.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

};
