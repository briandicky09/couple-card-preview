import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { sfx } from "@/lib/sound";

interface Heart {
  id: number;
  left: number;
  duration: number;
  delay: number;
  emoji: string;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const TARGET = 8;
const TIME_LIMIT = 12;

export function HeartCatchGame({ onDone }: { onDone: (stats: { caught: number; time: number }) => void }) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const startRef = useRef<number>(0);
  const idRef = useRef(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstIdRef = useRef(0);

  useEffect(() => {
    if (phase !== "play") return;
    startRef.current = performance.now();
    const spawn = window.setInterval(() => {
      idRef.current++;
      setHearts((h) => [
        ...h,
        {
          id: idRef.current,
          left: 5 + Math.random() * 85,
          duration: 3.8 + Math.random() * 1.6,
          delay: 0,
          emoji: Math.random() > 0.85 ? "💖" : Math.random() > 0.5 ? "♡" : "💕",
        },
      ]);
    }, 650);
    const tick = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      clearInterval(spawn);
      clearInterval(tick);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && (timeLeft <= 0 || caught >= TARGET)) {
      const elapsed = (performance.now() - startRef.current) / 1000;
      setPhase("done");
      setTimeout(() => onDone({ caught, time: elapsed }), 1100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, caught, phase]);

  const catchOne = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
    const x = rect.left - parentRect.left + rect.width / 2;
    const y = rect.top - parentRect.top + rect.height / 2;
    const heart = hearts.find((h) => h.id === id);
    const emoji = heart?.emoji ?? "💖";
    setHearts((h) => h.filter((x) => x.id !== id));
    setCaught((c) => c + 1);
    sfx.correct();
    burstIdRef.current++;
    const burstId = burstIdRef.current;
    setBursts((b) => [...b, { id: burstId, x, y, emoji }]);
    setTimeout(() => {
      setBursts((b) => b.filter((x) => x.id !== burstId));
    }, 700);
  };

  return (
    <PixelBackground variant="sunset">
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6">
          <div className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 font-pixel text-[10px] text-[var(--brown)]">
            ♡ {caught} / {TARGET}
          </div>
          <div className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 font-pixel text-[10px] text-[var(--brown)]">
            ⏱ {Math.max(0, timeLeft)}s
          </div>
        </div>

        {phase === "intro" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 220 }}
              className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-6 text-center max-w-sm"
            >
              <div className="font-pixel text-[10px] text-[var(--sage-deep)] mb-2">✦ MINI-GAME ✦</div>
              <h3 className="font-pixel text-base text-[var(--brown)] mb-3">CATCH THE HEARTS!</h3>
              <p className="font-display text-lg text-[var(--brown)] mb-5">
                Tap {TARGET} falling hearts before time runs out ♡
              </p>
              <PixelButton glow onClick={() => { sfx.click(); setPhase("play"); }}>
                ▶ START
              </PixelButton>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {hearts.map((h) => (
            <motion.button
              key={h.id}
              onClick={(e) => catchOne(h.id, e)}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: "100vh", opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: h.duration, ease: "linear" }}
              onAnimationComplete={() => setHearts((arr) => arr.filter((x) => x.id !== h.id))}
              className="absolute text-6xl sm:text-7xl select-none cursor-pointer p-3 -m-3 leading-none"
              style={{ left: `${h.left}%`, top: 0, color: "var(--pink-deep)" }}
            >
              {h.emoji}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Shatter bursts */}
        <AnimatePresence>
          {bursts.map((b) => (
            <div
              key={b.id}
              className="absolute pointer-events-none z-30"
              style={{ left: b.x, top: b.y }}
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const dist = 50 + Math.random() * 30;
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                    animate={{
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist + 20,
                      opacity: 0,
                      scale: 0.4,
                      rotate: (Math.random() - 0.5) * 240,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute text-2xl"
                    style={{ left: -8, top: -8, color: "var(--pink-deep)" }}
                  >
                    {i % 2 ? "♡" : "✦"}
                  </motion.span>
                );
              })}
              <motion.span
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute text-5xl"
                style={{ left: -20, top: -20, color: "var(--pink-deep)" }}
              >
                {b.emoji}
              </motion.span>
            </div>
          ))}
        </AnimatePresence>

        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/40"
          >
            <motion.div
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-6 text-center"
            >
              <div className="text-5xl mb-2">{caught >= TARGET ? "💖" : "♡"}</div>
              <div className="font-pixel text-sm text-[var(--brown)]">
                {caught} HEARTS CAUGHT
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PixelBackground>
  );
}
