import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { sfx } from "@/lib/sound";

const KEY = "kania-starry-wishes";

interface Wish {
  text: string;
  date: string;
}

interface Star {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
}

interface Shooting {
  id: number;
  top: number;
  duration: number;
  delay: number;
}

function loadWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function StarryNightWish() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => setWishes(loadWishes()), []);

  const stars: Star[] = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: (i * 37) % 100,
        top: (i * 53) % 90,
        size: (i % 3) + 2,
        delay: (i % 7) * 0.3,
      })),
    [],
  );

  const shootings: Shooting[] = useMemo(
    () =>
      Array.from({ length: 3 }).map((_, i) => ({
        id: i,
        top: 10 + i * 20,
        duration: 2.4 + i * 0.4,
        delay: i * 2.5,
      })),
    [],
  );

  const handleStarClick = (id: number) => {
    sfx.click();
    setPicked(id);
    setShowInput(true);
  };

  const saveWish = () => {
    const t = text.trim();
    if (!t) return;
    sfx.correct();
    const next = [...wishes, { text: t, date: new Date().toLocaleDateString() }];
    localStorage.setItem(KEY, JSON.stringify(next));
    setWishes(next);
    setText("");
    setShowInput(false);
    setPicked(null);
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-b from-[#0a0a2e] via-[#1a1145] to-[#2b1c5a] border-4 border-[var(--brown)] pixel-shadow-sm p-4 text-center relative overflow-hidden h-72">
      {/* Static stars */}
      {stars.map((s) => (
        <motion.button
          key={s.id}
          aria-label="make a wish"
          onClick={() => handleStarClick(s.id)}
          className="absolute cursor-pointer"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size * 2,
            height: s.size * 2,
            background: picked === s.id ? "#fff2b3" : "#fff8d6",
            boxShadow: picked === s.id ? "0 0 12px #fff2b3" : "0 0 4px #fff8d6",
          }}
          animate={{
            opacity: picked === s.id ? [1, 0.6, 1] : [0.4, 1, 0.4],
            scale: picked === s.id ? [1.4, 1.8, 1.4] : [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2 + (s.id % 3),
            repeat: Infinity,
            delay: s.delay,
          }}
          whileHover={{ scale: 2 }}
        />
      ))}

      {/* Shooting stars */}
      {shootings.map((sh) => (
        <motion.div
          key={sh.id}
          className="absolute pointer-events-none"
          style={{
            top: `${sh.top}%`,
            left: "-10%",
            width: 60,
            height: 2,
            background: "linear-gradient(90deg, transparent, #fff8d6, transparent)",
            filter: "drop-shadow(0 0 4px #fff8d6)",
          }}
          animate={{ x: ["0vw", "120vw"] }}
          transition={{
            duration: sh.duration,
            repeat: Infinity,
            delay: sh.delay,
            repeatDelay: 4,
            ease: "easeIn",
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 font-pixel text-[9px] text-[#fff8d6] mb-1">
        ✦ STARRY NIGHT WISH ✦
      </div>
      <div className="relative z-10 font-hand text-base text-[#f4a8c0] mb-2">
        click a star to make a wish ♡
      </div>

      <div className="relative z-10 font-pixel text-[7px] text-[#fff8d6]/70">
        {wishes.length} wishes on the sky
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-3 bottom-3 z-20 bg-[var(--cream)] border-2 border-[var(--brown)] p-2"
          >
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveWish()}
              placeholder="whisper your wish..."
              maxLength={80}
              className="w-full font-display text-sm text-[var(--brown)] bg-white/70 border border-[var(--brown)] px-2 py-1 outline-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setShowInput(false);
                  setPicked(null);
                  setText("");
                }}
                className="font-pixel text-[8px] px-2 py-1 border-2 border-[var(--brown)] text-[var(--brown)]"
              >
                ✕
              </button>
              <button
                onClick={saveWish}
                disabled={!text.trim()}
                className="font-pixel text-[8px] px-2 py-1 bg-[var(--pink-deep)] text-[var(--cream)] border-2 border-[var(--brown)] disabled:opacity-50"
              >
                ✦ WISH
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
