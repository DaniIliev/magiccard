"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { CanvasElement } from "@/store/editorStore";
import { Loader2, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface CardData {
  title: string;
  elements: CanvasElement[];
  background: string;
  audioUrl: string | null;
  globalEffect: string | null;
}

export default function ViewerPage() {
  const { id } = useParams();
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await api.get(`/cards/${id}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to load card", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  const handleOpen = () => {
    setIsOpen(true);
    if (data?.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(data.audioUrl);
      }
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }

    if (data?.globalEffect) {
      if (data.globalEffect === 'confetti') {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      } else if (data.globalEffect === 'fireworks') {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }, 250);
      } else if (data.globalEffect === 'snow') {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          confetti({
            particleCount: 2, angle: 90, spread: 45, origin: { x: Math.random(), y: 0 },
            colors: ['#ffffff'], shapes: ['circle'], gravity: 0.5, scalar: 1.2, drift: 0
          });
        }, 200);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.title || "Magic Card",
          text: "Check out this magical greeting card!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-slate-100"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center bg-slate-100"><h1 className="text-2xl font-bold text-slate-700">Card not found or private</h1></div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center overflow-hidden relative">
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0, y: -200 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm"
          >
            <div 
              onClick={handleOpen}
              className="group cursor-pointer flex flex-col items-center"
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-64 h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute top-0 w-full h-1/2 bg-white/40 skew-y-6 transform origin-top-left -z-0"></div>
                <Mail className="h-16 w-16 text-indigo-600 mb-2 z-10 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-800 z-10 text-lg">Tap to open</span>
              </motion.div>
              <div className="mt-8 text-white/60 text-sm animate-pulse">A magical greeting awaits...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative w-full max-w-[400px] h-[600px] sm:h-[700px] bg-white shadow-2xl md:rounded-2xl overflow-hidden md:border-8 md:border-white ring-1 ring-slate-800"
        style={{ background: data.background }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.9 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {data.elements.map((el) => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              zIndex: el.zIndex,
              width: el.width,
              height: el.height,
              ...el.style
            }}
          >
            {el.type === 'text' && (
              <div className="whitespace-pre-wrap select-none" style={{ 
                fontSize: el.style?.fontSize as string | number, 
                color: el.style?.color as string, 
                fontWeight: el.style?.fontWeight as any 
              }}>
                {el.content}
              </div>
            )}
            {el.type === 'image' && (
              <img src={el.content} alt="element" className="pointer-events-none w-full h-full object-cover" />
            )}
            {el.type === 'sticker' && (
              <div className="select-none" style={{ fontSize: el.style?.fontSize }}>
                {el.content}
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 z-40"
        >
          <Button onClick={handleShare} className="rounded-full shadow-2xl shadow-black/50 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white gap-2">
            <Share2 className="h-4 w-4" /> Share with friends
          </Button>
        </motion.div>
      )}
    </div>
  );
}
