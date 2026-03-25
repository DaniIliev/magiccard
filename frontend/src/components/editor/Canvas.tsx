"use client";

import { useEditorStore } from "@/store/editorStore";
import DraggableElement from "./DraggableElement";
import { useRef, useEffect } from "react";
import confetti from "canvas-confetti";

export default function Canvas() {
  const { elements, background, selectElement, globalEffect } = useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (globalEffect === 'confetti') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (globalEffect === 'fireworks') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);
    } else if (globalEffect === 'snow') {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        confetti({
          particleCount: 2, angle: 90, spread: 45, origin: { x: Math.random(), y: 0 },
          colors: ['#ffffff'], shapes: ['circle'], gravity: 0.5, scalar: 1.2, drift: 0
        });
      }, 200);
    }
  }, [globalEffect]);

  return (
    <div 
      className="relative w-full max-w-[400px] h-[600px] bg-white shadow-2xl rounded-2xl overflow-hidden border-4 border-white ring-1 ring-slate-200"
      style={{ background }}
      onClick={() => selectElement(null)}
      ref={canvasRef}
    >
      {/* Global Effects like Snow/Confetti could be added here later */}
      
      {elements.map((el) => (
        <DraggableElement key={el.id} element={el} canvasRef={canvasRef} />
      ))}
    </div>
  );
}
