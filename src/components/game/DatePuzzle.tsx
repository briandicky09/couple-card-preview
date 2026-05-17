import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { PixelConfetti } from "./Confetti";
import { sfx } from "@/lib/sound";

const ALL_DATES: { label: string; date: string; emoji: string; note: string }[] = [
  {
    label: "First time we met",
    date: "2024-11-06",
    emoji: "👋",
    note: "It all started with borrowing bread — lanik bread, of course haha",
  },
  {
    label: "We started dating",
    date: "2025-01-02",
    emoji: "💑",
    note: "The day we first held hands — unofficial but unforgettable",
  },
  {
    label: "Kania's birthday",
    date: "2006-05-24",
    emoji: "🎂",
    note: "The birthday of the one I love most",
  },
  {
    label: "Bobong's birthday",
    date: "2006-05-09",
    emoji: "🎉",
    note: "The birthday of the handsome Bobong",
  },
  {
    label: "Our first date",
    date: "2025-02-05",
    emoji: "🌹",
    note: "A moment always remembered — the start of us",
  },
];

const SORTED = [...ALL_DATES].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface Props {
  onDone: (stats: { time: number; ok: boolean }) => void;
}

export function DatePuzzle({ onDone }: Props) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [items, setItems] = useState(() => shuffle(ALL_DATES));
  const [correct, setCorrect] = useState(false);
  const [startTime] = useState(() => performance.now());
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const moveUp = (i: number) => {
    if (i === 0) return;
    sfx.click();
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setItems(next);
  };

  const moveDown = (i: number) => {
    if (i === items.length - 1) return;
    sfx.click();
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setItems(next);
  };

  const checkAnswer = () => {
    setAttempts((a) => a + 1);
    const isCorrect = items.every((item, i) => item.label === SORTED[i].label);
    if (isCorrect) {
      sfx.win();
      setCorrect(true);
      setPhase("done");
      setTimeout(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        onDone({ time: elapsed, ok: true });
      }, 2200);
    } else {
      sfx.wrong();
      setShowHint(true);
    }
  };

  return (
    <PixelBackground variant="garden">
      <div className="relative h-full w-full flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
        {correct && <PixelConfetti count={80} />}

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 text-center z-10"
        >
          <div className="font-pixel text-[9px] text-[var(--sage-deep)] tracking-widest mb-1">
            ✦ MINI-GAME ✦
          </div>
          <h2 className="font-pixel text-lg sm:text-2xl text-[var(--brown)]">DATE PUZZLE</h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center mt-8 max-w-xs"
            >
              <div className="text-5xl mb-4">🧩</div>
              <div className="font-pixel text-sm text-[var(--brown)] mb-3">DATE PUZZLE</div>
              <p className="font-hand text-xl text-[var(--brown)] mb-2 leading-relaxed">
                Arrange our special moments from earliest to most recent!
              </p>
              <p className="font-pixel text-[9px] text-[var(--brown)] opacity-60 mb-6">
                Use ▲ ▼ to reorder the items
              </p>
              <PixelButton onClick={() => { sfx.click(); setPhase("play"); }}>
                ▶ START
              </PixelButton>
            </motion.div>
          )}

          {(phase === "play" || phase === "done") && (
            <motion.div
              key="play"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-sm"
            >
              <p className="font-pixel text-[9px] text-[var(--brown)] text-center mb-3 opacity-70">
                order from EARLIEST → MOST RECENT
              </p>

              {/* List */}
              <div className="space-y-2 mb-4">
                {items.map((item, i) => (
                  <motion.div
                    key={item.label}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, layout: { type: "spring", stiffness: 300, damping: 30 } }}
                    className={`flex items-center gap-2 bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 ${
                      correct ? "border-[var(--sage-deep)]" : ""
                    }`}
                  >
                    <div className="font-pixel text-[9px] text-[var(--brown)] w-4 shrink-0 opacity-50">
                      {i + 1}
                    </div>
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-pixel text-[10px] text-[var(--brown)] leading-tight">{item.label}</p>
                    </div>
                    {!correct && (
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moveUp(i)}
                          disabled={i === 0}
                          className="font-pixel text-[9px] w-6 h-5 bg-[var(--beige)] border-2 border-[var(--brown)] text-[var(--brown)] disabled:opacity-20 hover:bg-[var(--sage)] leading-none"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveDown(i)}
                          disabled={i === items.length - 1}
                          className="font-pixel text-[9px] w-6 h-5 bg-[var(--beige)] border-2 border-[var(--brown)] text-[var(--brown)] disabled:opacity-20 hover:bg-[var(--sage)] leading-none"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                    {correct && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        className="text-lg shrink-0"
                      >
                        ✅
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Hint */}
              <AnimatePresence>
                {showHint && !correct && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-3 bg-[var(--pink)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 text-center"
                  >
                    <p className="font-pixel text-[9px] text-[var(--cream)]">
                      Not quite! Try again ♡
                    </p>
                    {attempts >= 3 && (
                      <p className="font-hand text-sm text-[var(--cream)] mt-1">
                        Hint: start with the oldest year first~
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Done state */}
              <AnimatePresence>
                {correct && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-4"
                  >
                    <p className="font-pixel text-sm text-[var(--sage-deep)] mb-1">✓ CORRECT!</p>
                    <p className="font-hand text-xl text-[var(--brown)]">
                      You remembered all our special moments 💕
                    </p>
                    <div className="mt-3 space-y-1">
                      {SORTED.map((item) => (
                        <p key={item.label} className="font-pixel text-[8px] text-[var(--brown)] opacity-70">
                          {item.emoji} {formatDate(item.date)} — {item.label}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Check button */}
              {!correct && (
                <div className="flex justify-center">
                  <PixelButton onClick={checkAnswer}>
                    ✓ CHECK ANSWER
                  </PixelButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PixelBackground>
  );
}
