import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/lib/sound";

const KEY = "kania-pixel-pet";
const QUOTES = [
  "meow~ bobong loves kania ♡",
  "purrr... you're the best!",
  "*pat pat* feels good!",
  "kania is my favorite human ♡",
  "meow! kasih makan dong~",
  "you smell like sunshine ☀",
  "i'd choose you in every life ♡",
  "purr-fect day with you!",
];

interface PetState {
  happiness: number;
  hunger: number;
  pets: number;
  feeds: number;
}

function load(): PetState {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return { happiness: 60, hunger: 40, pets: 0, feeds: 0 };
}

export function PixelPet() {
  const [state, setState] = useState<PetState>(load);
  const [quote, setQuote] = useState<string | null>(null);
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const showQuote = () => {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(q);
    setTimeout(() => setQuote(null), 2600);
  };

  const pet = () => {
    sfx.click();
    setState((s) => ({
      ...s,
      happiness: Math.min(100, s.happiness + 8),
      pets: s.pets + 1,
    }));
    setBounce((b) => b + 1);
    showQuote();
  };

  const feed = () => {
    sfx.correct();
    setState((s) => ({
      ...s,
      hunger: Math.max(0, s.hunger - 20),
      happiness: Math.min(100, s.happiness + 4),
      feeds: s.feeds + 1,
    }));
    setBounce((b) => b + 1);
    showQuote();
  };

  const mood = state.happiness > 70 ? "♡" : state.happiness > 40 ? "·" : "˘";

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4">
      <div className="font-pixel text-[10px] text-[var(--pink-deep)] mb-3 text-center">
        ✦ PIXEL PET — MOCHI ✦
      </div>

      <div className="relative h-32 flex items-end justify-center bg-[var(--sage)]/30 border-2 border-[var(--brown)] mb-3 overflow-hidden">
        <AnimatePresence>
          {quote && (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1 left-1/2 -translate-x-1/2 font-hand text-base text-[var(--brown)] bg-[var(--cream)] border-2 border-[var(--brown)] px-2 py-0.5 whitespace-nowrap max-w-[90%] truncate"
            >
              "{quote}"
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          key={bounce}
          onClick={pet}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1], y: [0, -8, 0] }}
          transition={{ duration: 0.4 }}
          className="mb-3 cursor-pointer select-none"
          aria-label="pet the cat"
        >
          <PixelCat mood={mood} />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-left">
        <Stat label="HAPPY" value={state.happiness} color="var(--pink-deep)" />
        <Stat label="FULL" value={100 - state.hunger} color="var(--sage-deep)" />
      </div>

      <div className="flex gap-2 justify-center">
        <button
          onClick={pet}
          className="font-pixel text-[9px] px-3 py-2 bg-[var(--pink)] text-[var(--brown)] border-2 border-[var(--brown)] pixel-shadow-sm"
        >
          ✋ PET
        </button>
        <button
          onClick={feed}
          className="font-pixel text-[9px] px-3 py-2 bg-[var(--sage)] text-[var(--brown)] border-2 border-[var(--brown)] pixel-shadow-sm"
        >
          🍣 FEED
        </button>
        <button
          onClick={showQuote}
          className="font-pixel text-[9px] px-3 py-2 bg-[var(--cream)] text-[var(--brown)] border-2 border-[var(--brown)] pixel-shadow-sm"
        >
          💬 TALK
        </button>
      </div>

      <div className="mt-2 font-pixel text-[8px] text-[var(--brown)]/70 text-center">
        {state.pets} pets · {state.feeds} feeds
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="font-pixel text-[8px] text-[var(--brown)]/70 mb-1">{label}</div>
      <div className="h-3 w-full bg-[var(--beige)] border-2 border-[var(--brown)]">
        <div className="h-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function PixelCat({ mood }: { mood: string }) {
  // Simple pixel kitty using divs
  const p = "absolute";
  const px = (x: number, y: number, c: string, w = 6, h = 6) => (
    <div
      key={`${x}-${y}`}
      className={p}
      style={{ left: x, top: y, width: w, height: h, background: c }}
    />
  );
  return (
    <div className="relative" style={{ width: 72, height: 64 }}>
      {/* ears */}
      {px(8, 0, "#d4a373")}
      {px(14, 0, "#d4a373")}
      {px(50, 0, "#d4a373")}
      {px(56, 0, "#d4a373")}
      {/* head/body */}
      {px(8, 6, "#e8b88f", 56, 36)}
      {/* eyes */}
      {px(20, 18, "#3a2a1a", 6, 6)}
      {px(46, 18, "#3a2a1a", 6, 6)}
      {/* blush */}
      {px(16, 28, "#f4a8c0", 6, 4)}
      {px(50, 28, "#f4a8c0", 6, 4)}
      {/* mouth (mood) */}
      <div
        className="absolute font-pixel text-[10px] text-[#3a2a1a]"
        style={{ left: 30, top: 28 }}
      >
        {mood}
      </div>
      {/* feet */}
      {px(14, 42, "#d4a373", 12, 8)}
      {px(46, 42, "#d4a373", 12, 8)}
      {/* tail */}
      {px(62, 18, "#d4a373", 8, 16)}
    </div>
  );
}
