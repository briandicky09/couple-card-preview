import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { sfx } from "@/lib/sound";

import photo1 from "@/assets/photos/photo1.jpg";
import photo2 from "@/assets/photos/photo2.jpg";
import photo3 from "@/assets/photos/photo3.jpg";
import photo4 from "@/assets/photos/photo4.jpg";
import photo5 from "@/assets/photos/photo5.jpg";

const MEMORIES: { src: string; caption: string; date: string; objectPosition?: string }[] = [
  {
    src: photo1,
    caption: "The beginning — when we exchanged gifts, thank you for the perfume, love ♡",
    date: "2025",
    objectPosition: "center 20%",
  },
  {
    src: photo2,
    caption: "Our first pecel lele date together",
    date: "2025",
  },
  {
    src: photo3,
    caption: "Our first photobooth — you looked absolutely beautiful",
    date: "2025",
  },
  {
    src: photo4,
    caption: "Reunited at lanik — you in hima, me in bimen ♡",
    date: "2025",
  },
  {
    src: photo5,
    caption: "Photobooth again — the one where I said your friend looked like a gangster hahaha",
    date: "2026",
  },
];

interface Props {
  onDone: () => void;
}

const SLIDE_DURATION = 4000;

export function MemoryReel({ onDone }: Props) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (paused || finished) return;
    setProgress(0);
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        if (idx + 1 < MEMORIES.length) {
          sfx.click();
          setIdx((i) => i + 1);
        } else {
          setFinished(true);
        }
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [idx, paused, finished]);

  const goTo = (i: number) => {
    sfx.click();
    setIdx(i);
    setProgress(0);
    setFinished(false);
  };

  return (
    <PixelBackground variant="night">
      <div className="relative h-full w-full flex flex-col items-center px-4 py-6 overflow-y-auto overscroll-contain">

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 text-center z-10"
        >
          <div className="font-pixel text-[9px] text-[var(--pink)] tracking-widest mb-1">
            ✦ MEMORY REEL ✦
          </div>
          <p className="font-hand text-xl text-[var(--cream)]">our moments together ♡</p>
        </motion.div>

        {/* Progress strips */}
        <div className="flex gap-1 w-full max-w-sm mb-4 z-10">
          {MEMORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="flex-1 h-1 bg-[var(--cream)] opacity-30 overflow-hidden"
            >
              <div
                className="h-full bg-[var(--pink)] transition-none"
                style={{
                  width:
                    i < idx
                      ? "100%"
                      : i === idx
                      ? `${progress * 100}%`
                      : "0%",
                }}
              />
            </button>
          ))}
        </div>

        {/* Photo frame */}
        <div
          className="relative w-full max-w-sm z-10"
          onClick={() => setPaused((p) => !p)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-3"
            >
              {/* Photo */}
              <div className="relative w-full aspect-[4/3] bg-[var(--beige)] overflow-hidden mb-2">
                <img
                  src={MEMORIES[idx].src}
                  alt={MEMORIES[idx].caption}
                  className="w-full h-full object-cover"
                  style={{
                    imageRendering: "auto",
                    objectPosition: MEMORIES[idx].objectPosition ?? "center",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Placeholder overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--beige)]" style={{ zIndex: -1 }}>
                  <div className="text-5xl mb-2">📷</div>
                  <p className="font-pixel text-[9px] text-[var(--brown)] opacity-50">photo #{idx + 1}</p>
                </div>

                {/* Corner decorations */}
                {["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map((c, i) => (
                  <div key={i} className={`absolute ${c} w-3 h-3 border-2 border-[var(--brown)] opacity-40`} />
                ))}

                {/* Paused overlay */}
                {paused && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="font-pixel text-[10px] text-[var(--cream)]">⏸ PAUSED</div>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="text-center px-1">
                <p className="font-hand text-lg text-[var(--brown)] leading-snug">
                  {MEMORIES[idx].caption}
                </p>
                <p className="font-pixel text-[8px] text-[var(--brown)] opacity-50 mt-1">
                  {MEMORIES[idx].date}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Tap hint */}
          <p className="font-pixel text-[8px] text-[var(--cream)] opacity-40 text-center mt-2">
            tap photo to {paused ? "resume" : "pause"}
          </p>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-4 mt-4 z-10">
          <button
            onClick={() => idx > 0 && goTo(idx - 1)}
            disabled={idx === 0}
            className="font-pixel text-[10px] px-3 py-2 bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] disabled:opacity-30"
          >
            ◀ PREV
          </button>

          <span className="font-pixel text-[9px] text-[var(--cream)] opacity-60">
            {idx + 1} / {MEMORIES.length}
          </span>

          <button
            onClick={() => idx < MEMORIES.length - 1 ? goTo(idx + 1) : setFinished(true)}
            className="font-pixel text-[10px] px-3 py-2 bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)]"
          >
            NEXT ▶
          </button>
        </div>

        {/* Finish button */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 z-10 text-center"
            >
              <p className="font-hand text-xl text-[var(--pink)] mb-3">
                may these memories always stay with us ♡
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <PixelButton
                  onClick={() => {
                    sfx.click();
                    setIdx(0);
                    setProgress(0);
                    setFinished(false);
                    setPaused(false);
                  }}
                >
                  ↻ PLAY AGAIN
                </PixelButton>
                <PixelButton glow onClick={() => { sfx.click(); onDone(); }}>
                  ↩ GO BACK
                </PixelButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating hearts */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg pointer-events-none"
            initial={{ y: "100vh", x: `${(i / 10) * 100}%`, opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
            transition={{ duration: 10 + i * 1.2, repeat: Infinity, delay: i * 0.8 }}
          >
            ♡
          </motion.div>
        ))}
      </div>
    </PixelBackground>
  );
}
