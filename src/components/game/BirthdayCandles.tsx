import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { sfx } from "@/lib/sound";
import { PixelConfetti } from "./Confetti";

const TOTAL_CANDLES = 20;
const SECRET_MESSAGE =
  "Happy 20th birthday, Kania ♡\nMay this new chapter of your life be filled with joy,\nlaughter, and every beautiful thing you deserve.\nYou are the best thing that has ever happened to me ♡";

interface Props {
  onDone: () => void;
}

export function BirthdayCandles({ onDone }: Props) {
  const [blown, setBlown] = useState<Set<number>>(new Set());
  const [showSecret, setShowSecret] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [phase, setPhase] = useState<"intro" | "blowing" | "done">("intro");
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (phase !== "blowing") return;
    const t = setTimeout(() => setHint(true), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (blown.size === TOTAL_CANDLES && phase === "blowing") {
      sfx.win();
      setShowConfetti(true);
      setTimeout(() => {
        setShowSecret(true);
        setPhase("done");
      }, 1200);
    }
  }, [blown, phase]);

  const blowCandle = (i: number) => {
    if (blown.has(i) || phase !== "blowing") return;
    sfx.correct();
    setBlown((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  };

  const blowAll = () => {
    if (phase !== "blowing") return;
    sfx.win();
    const all = new Set(Array.from({ length: TOTAL_CANDLES }, (_, i) => i));
    setBlown(all);
  };

  const rows = [
    Array.from({ length: 10 }, (_, i) => i),
    Array.from({ length: 10 }, (_, i) => i + 10),
  ];

  return (
    <PixelBackground variant="night">
      {showConfetti && <PixelConfetti count={100} />}

      <div className="relative h-full w-full flex flex-col items-center justify-center px-4 py-6 text-center overflow-y-auto">

        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 z-10"
        >
          <div className="font-pixel text-[9px] text-[var(--pink)] tracking-widest mb-1">
            ✦ SPECIAL SCENE ✦
          </div>
          <h2 className="font-pixel text-xl sm:text-3xl text-[var(--cream)] text-pixel-shadow">
            HAPPY BIRTHDAY
          </h2>
          <p className="font-hand text-2xl text-[var(--pink)] mt-1">Kania, Level 20 ♡</p>
        </motion.div>

        {/* Cake & Candles */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="z-10 mb-6"
            >
              <div className="font-hand text-xl text-[var(--cream)] mb-6 max-w-xs mx-auto leading-relaxed">
                There's a special cake waiting for you today...<br />
                blow out all 20 candles and find your surprise! 🎂
              </div>
              <PixelButton glow onClick={() => { sfx.click(); setPhase("blowing"); }}>
                🎂 BLOW THE CANDLES!
              </PixelButton>
            </motion.div>
          )}

          {(phase === "blowing" || phase === "done") && (
            <motion.div
              key="cake"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="z-10 w-full max-w-sm"
            >
              {/* Candle grid */}
              <div className="mb-4">
                {rows.map((row, ri) => (
                  <div key={ri} className="flex justify-center gap-2 mb-2">
                    {row.map((i) => (
                      <Candle
                        key={i}
                        blown={blown.has(i)}
                        onClick={() => blowCandle(i)}
                        delay={i * 0.03}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Cake body */}
              <motion.div
                className="mx-auto bg-[var(--pink)] border-4 border-[var(--brown)] pixel-shadow overflow-hidden"
                style={{ width: "90%", borderRadius: 0 }}
              >
                {/* Frosting drips */}
                <div className="flex justify-around px-2 pt-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[var(--cream)] border-2 border-[var(--brown)]"
                      style={{
                        width: 12,
                        height: 10 + (i % 3) * 6,
                        borderTop: "none",
                        borderRadius: "0 0 4px 4px",
                      }}
                    />
                  ))}
                </div>
                {/* Cake layers */}
                <div className="bg-[var(--cream)] border-t-4 border-[var(--brown)] py-4 px-4">
                  <div className="font-pixel text-[10px] text-[var(--brown)] text-center">
                    🎂 KANIA 🎂
                  </div>
                </div>
                <div className="bg-[var(--pink-deep)] border-t-4 border-[var(--brown)] py-3" />
                <div className="bg-[var(--cream)] border-t-4 border-[var(--brown)] py-3" />
              </motion.div>

              {/* Counter & blow-all */}
              {phase === "blowing" && (
                <div className="mt-4 flex flex-col items-center gap-3">
                  <div className="font-pixel text-[10px] text-[var(--cream)]">
                    {blown.size} / {TOTAL_CANDLES} candles blown out
                  </div>
                  <AnimatePresence>
                    {hint && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-hand text-base text-[var(--pink)] opacity-80"
                      >
                        tap each candle to blow it out ♡
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={blowAll}
                    className="font-pixel text-[9px] px-3 py-2 bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] hover:bg-[var(--pink)] opacity-70"
                  >
                    💨 BLOW ALL AT ONCE
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secret message */}
        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, delay: 0.3 }}
              className="mt-6 w-full max-w-sm z-10"
            >
              <div className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-5 text-center">
                <div className="font-pixel text-[9px] text-[var(--sage-deep)] mb-3">✦ SECRET MESSAGE ✦</div>
                <p className="font-hand text-lg text-[var(--brown)] leading-relaxed whitespace-pre-line">
                  {SECRET_MESSAGE}
                </p>
                <div className="mt-4">
                  <PixelButton glow onClick={() => { sfx.click(); onDone(); }}>
                    CONTINUE ➤
                  </PixelButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stars bg */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-sm pointer-events-none"
            style={{ left: `${10 + i * 11}%`, top: `${5 + (i % 3) * 8}%` }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
          >
            ✦
          </motion.div>
        ))}
      </div>
    </PixelBackground>
  );
}

function Candle({ blown, onClick, delay }: { blown: boolean; onClick: () => void; delay: number }) {
  return (
    <motion.button
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer select-none"
      style={{ width: 20 }}
      whileHover={!blown ? { scale: 1.2 } : {}}
      whileTap={!blown ? { scale: 0.9 } : {}}
    >
      {/* Flame */}
      <AnimatePresence>
        {!blown ? (
          <motion.div
            key="flame"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 0.95, 1.05, 1], y: [0, -1, 1, -1, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="mb-px"
            style={{
              width: 6,
              height: 9,
              background: "linear-gradient(to bottom, #fff2b3, #ffaa00)",
              borderRadius: "50% 50% 30% 30%",
              boxShadow: "0 0 6px #ffcc00",
            }}
          />
        ) : (
          <motion.div
            key="smoke"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8 }}
            className="mb-px font-pixel text-[8px] text-[var(--cream)] opacity-40"
          >
            ~
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wax body */}
      <div
        className="border-2 border-[var(--brown)]"
        style={{
          width: 8,
          height: 20,
          background: blown ? "#a0a0a0" : `hsl(${(delay * 1000) % 360}, 80%, 70%)`,
          transition: "background 0.3s",
        }}
      />
    </motion.button>
  );
}
