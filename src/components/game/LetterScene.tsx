import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import { PixelBackground } from "./PixelBackground";
import { Typewriter } from "./Typewriter";
import { sfx, startClosingMusic, stopClosingMusic } from "@/lib/sound";

import coupleImg from "@/assets/couple.jpg";

const PARAGRAPHS = [
  "Thank you for being the softest part of my every day. You turn ordinary mornings into little adventures and quiet nights into something I never want to end.",
  "Since the day our story began, every small moment with you has felt like a pixel in a picture I'm slowly falling more in love with.",
  "Happy birthday, Kania. I hope this tiny game made you smile — because that smile is my favorite reward of all. Here's to more songs, more flowers, and a million more stars together.",
];

type Stage = "closed" | "opening" | "open";

export function LetterScene({ onRestart, onMemory }: { onRestart?: () => void; onMemory?: () => void } = {}) {
  const [stage, setStage] = useState<Stage>("closed");
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "opening") {
      const t = setTimeout(() => setStage("open"), 1700);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // Start soft closing music once the letter is fully open
  useEffect(() => {
    if (stage === "open") startClosingMusic();
    return () => stopClosingMusic();
  }, [stage]);

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    sfx.click();
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fbf3df",
      });
      const link = document.createElement("a");
      link.download = "letter-for-kania.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleRestart = () => {
    sfx.click();
    stopClosingMusic();
    onRestart?.();
  };

  return (
    <PixelBackground variant="garden">
      <div className="relative h-full w-full flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl pointer-events-none"
            initial={{ y: -20, x: `${(i / 14) * 100}%`, opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration: 12 + i, repeat: Infinity, delay: i * 0.7, ease: "linear" }}
          >
            🌸
          </motion.div>
        ))}

        <AnimatePresence mode="wait">
        {stage === "closed" && (
          <motion.button
            key="closed"
            onClick={() => setStage("opening")}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-8 animate-glow"
          >
            <div className="text-7xl mb-3">💌</div>
            <div className="font-pixel text-xs text-[var(--brown)]">CLICK TO OPEN</div>
          </motion.button>
        )}

        {stage === "opening" && (
          <motion.div
            key="opening"
            className="relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Envelope body */}
            <div className="relative w-64 h-40 bg-[var(--pink)] border-4 border-[var(--brown)] pixel-shadow overflow-hidden">
              {/* Paper sliding up out of envelope */}
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: -110, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                className="absolute left-1/2 -translate-x-1/2 top-2 w-52 h-44 bg-[#fbf3df] border-4 border-[var(--brown)] pixel-shadow-sm"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(180deg, transparent 0, transparent 10px, rgba(168,120,80,0.18) 10px, rgba(168,120,80,0.18) 11px)",
                }}
              >
                <div className="font-hand text-xl text-[var(--brown)] text-center mt-2">♡</div>
              </motion.div>
              {/* Bottom front of envelope (covers paper start) */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--pink-deep)] border-t-4 border-[var(--brown)]" style={{ clipPath: "polygon(0 0, 50% 60%, 100% 0, 100% 100%, 0 100%)" }} />
              {/* Top flap opening */}
              <motion.div
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -170 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-x-0 top-0 h-1/2 bg-[var(--pink-deep)] border-b-4 border-[var(--brown)] origin-top"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformStyle: "preserve-3d" }}
              />
            </div>
            <div className="font-pixel text-[10px] text-[var(--brown)] text-center mt-4 animate-pulse">
              opening...
            </div>
          </motion.div>
        )}

        {stage === "open" && (
          <motion.div
            key="open"
            initial={{ scale: 0.3, rotateX: 90, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "backOut" }}
            className="relative w-full max-w-lg my-6"
          >
            <div
              ref={cardRef}
              className="relative bg-[#fbf3df] border-4 border-[var(--brown)] pixel-shadow p-6 sm:p-9"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, transparent 0, transparent 30px, rgba(168,120,80,0.12) 30px, rgba(168,120,80,0.12) 31px)",
              }}
            >
              <div className="font-pixel text-[10px] text-[var(--sage-deep)] mb-2 text-center">
                ✦ FROM ME, TO YOU ✦
              </div>

              {/* Pixel-framed photo */}
              <motion.div
                initial={{ scale: 0, rotate: -6 }}
                animate={{ scale: 1, rotate: -2 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
                className="mx-auto mb-5 w-[68%] bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-2"
              >
                <img
                  src={coupleImg}
                  alt="A picture of us"
                  className="w-full aspect-[4/5] object-cover"
                  style={{ imageRendering: "auto" }}
                  crossOrigin="anonymous"
                />
                <div className="font-hand text-xl text-[var(--brown)] text-center mt-1">us ♡</div>
              </motion.div>

              <h2 className="font-hand text-4xl sm:text-5xl text-[var(--brown)] text-center mb-5">
                My dearest Kania,
              </h2>

              <div className="font-display text-lg sm:text-xl text-[var(--brown)] leading-relaxed space-y-3 min-h-[12rem]">
                {PARAGRAPHS.slice(0, step + 1).map((p, i) => (
                  <p key={i}>
                    {i === step ? (
                      <Typewriter
                        text={p}
                        speed={22}
                        cursor
                        onDone={() => {
                          if (step < PARAGRAPHS.length - 1) {
                            setTimeout(() => setStep((s) => s + 1), 500);
                          }
                        }}
                      />
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>

              {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((c, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${c} text-[var(--pink-deep)]`}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  ✦
                </motion.div>
              ))}
            </div>

            {/* Action buttons */}
            {step >= PARAGRAPHS.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2, duration: 0.4 }}
                className="mt-5 flex flex-wrap items-center justify-center gap-3"
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="font-pixel text-[10px] px-4 py-3 bg-[var(--sage)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] hover:bg-[var(--cream)] disabled:opacity-60"
                >
                  {saving ? "SAVING..." : "💾 SAVE AS IMAGE"}
                </button>
                {onMemory && (
                  <button
                    onClick={() => { sfx.click(); stopClosingMusic(); onMemory(); }}
                    className="font-pixel text-[10px] px-4 py-3 bg-[var(--pink)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] hover:bg-[var(--pink-deep)] hover:text-[var(--cream)]"
                  >
                    📷 MEMORY REEL
                  </button>
                )}
                {onRestart && (
                  <button
                    onClick={handleRestart}
                    className="font-pixel text-[10px] px-4 py-3 bg-[var(--pink-deep)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--cream)] hover:bg-[var(--pink)] hover:text-[var(--brown)]"
                  >
                    ↻ PLAY AGAIN
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </PixelBackground>
  );
}
