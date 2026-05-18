import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sound";

const KEY = "kania-wish-jar";

interface Wish {
  text: string;
  date: string;
}

function loadWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishJar() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  useEffect(() => {
    setWishes(loadWishes());
  }, []);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    sfx.correct();
    const next = [...wishes, { text: t, date: new Date().toLocaleDateString() }];
    localStorage.setItem(KEY, JSON.stringify(next));
    setWishes(next);
    setText("");
    setShowAll(true);
    setJustDropped(true);
    setTimeout(() => setJustDropped(false), 1600);
  };

  const removeWish = (idx: number) => {
    const next = wishes.filter((_, i) => i !== idx);
    localStorage.setItem(KEY, JSON.stringify(next));
    setWishes(next);
  };

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🫙</span>
        <div className="font-pixel text-[10px] text-[var(--pink-deep)]">WISH JAR</div>
      </div>

      <AnimatePresence mode="wait">
        {randomWish && (
          <motion.div
            key={randomWish.text}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 px-3 py-2 bg-[var(--pink)]/30 border-2 border-dashed border-[var(--brown)]"
          >
            <div className="font-pixel text-[8px] text-[var(--sage-deep)] mb-1">
              ✦ A WISH FROM {randomWish.date.toUpperCase()}
            </div>
            <div className="font-hand text-lg text-[var(--brown)] leading-tight">
              "{randomWish.text}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="write a little wish or hope..."
        rows={2}
        maxLength={140}
        className="w-full font-display text-base text-[var(--brown)] bg-white/70 border-2 border-[var(--brown)] p-2 outline-none resize-none placeholder:text-[var(--brown)]/50"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="font-pixel text-[8px] text-[var(--brown)]/70">
          {wishes.length} saved
        </span>
        <button
          onClick={submit}
          disabled={!text.trim()}
          className="font-pixel text-[9px] px-3 py-2 bg-[var(--pink-deep)] text-[var(--cream)] border-2 border-[var(--brown)] pixel-shadow-sm disabled:opacity-50"
        >
          ♡ DROP WISH
        </button>
      </div>
    </div>
  );
}
