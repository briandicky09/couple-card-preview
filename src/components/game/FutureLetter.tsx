import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sound";

const KEY = "kania-future-letters";

interface FutureLetter {
  id: string;
  text: string;
  openDate: string; // YYYY-MM-DD
  createdAt: string;
}

function load(): FutureLetter[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultDate(): string {
  // Next 5 Feb anniversary
  const now = new Date();
  const y = now >= new Date(now.getFullYear(), 1, 5) ? now.getFullYear() + 1 : now.getFullYear();
  return `${y}-02-05`;
}

export function FutureLetter() {
  const [letters, setLetters] = useState<FutureLetter[]>([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState(defaultDate());
  const [opening, setOpening] = useState<FutureLetter | null>(null);

  useEffect(() => setLetters(load()), []);

  const persist = (next: FutureLetter[]) => {
    setLetters(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const save = () => {
    const t = text.trim();
    if (!t || !date) return;
    sfx.correct();
    const next: FutureLetter[] = [
      ...letters,
      {
        id: Math.random().toString(36).slice(2),
        text: t,
        openDate: date,
        createdAt: todayISO(),
      },
    ];
    persist(next);
    setText("");
    setDate(defaultDate());
  };

  const today = todayISO();
  const ready = letters.filter((l) => l.openDate <= today);
  const sealed = letters.filter((l) => l.openDate > today);

  const daysUntil = (d: string) => {
    const ms = new Date(d).getTime() - new Date(today).getTime();
    return Math.ceil(ms / 86400000);
  };

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">📮</span>
        <div className="font-pixel text-[10px] text-[var(--pink-deep)]">
          FUTURE LETTER
        </div>
      </div>
      <div className="font-hand text-base text-[var(--brown)] mb-3">
        write a letter to open later ♡
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="dear future kania..."
        rows={2}
        maxLength={300}
        className="w-full font-display text-base text-[var(--brown)] bg-white/70 border-2 border-[var(--brown)] p-2 outline-none resize-none placeholder:text-[var(--brown)]/50"
      />
      <div className="flex items-center gap-2 mt-2">
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 font-pixel text-[8px] text-[var(--brown)] bg-white/70 border-2 border-[var(--brown)] px-2 py-2 outline-none"
        />
        <button
          onClick={save}
          disabled={!text.trim() || !date}
          className="font-pixel text-[9px] px-3 py-2 bg-[var(--pink-deep)] text-[var(--cream)] border-2 border-[var(--brown)] pixel-shadow-sm disabled:opacity-50"
        >
          ✉ SEAL
        </button>
      </div>

      {/* Ready to open */}
      {ready.length > 0 && (
        <div className="mt-3">
          <div className="font-pixel text-[8px] text-[var(--sage-deep)] mb-1">
            ✦ READY TO OPEN ({ready.length})
          </div>
          <div className="space-y-1">
            {ready.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  sfx.click();
                  setOpening(l);
                }}
                className="w-full text-left px-2 py-1 bg-[var(--pink)]/30 border-2 border-dashed border-[var(--brown)] font-hand text-sm text-[var(--brown)] hover:bg-[var(--pink)]/50"
              >
                💌 letter for {l.openDate}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sealed */}
      {sealed.length > 0 && (
        <div className="mt-3">
          <div className="font-pixel text-[8px] text-[var(--brown)]/70 mb-1">
            🔒 SEALED ({sealed.length})
          </div>
          <div className="space-y-1">
            {sealed.map((l) => (
              <div
                key={l.id}
                className="px-2 py-1 bg-[var(--sage)]/20 border-2 border-[var(--brown)]/40 font-hand text-sm text-[var(--brown)]/70 flex justify-between"
              >
                <span>🔒 {l.openDate}</span>
                <span className="font-pixel text-[7px]">
                  in {daysUntil(l.openDate)}d
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {opening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setOpening(null)}
          >
            <motion.div
              initial={{ scale: 0.7, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-5"
            >
              <div className="font-pixel text-[9px] text-[var(--pink-deep)] mb-1">
                ✦ A LETTER FROM {opening.createdAt}
              </div>
              <div className="font-pixel text-[8px] text-[var(--sage-deep)] mb-3">
                opens: {opening.openDate}
              </div>
              <div className="font-hand text-xl text-[var(--brown)] whitespace-pre-wrap leading-snug">
                {opening.text}
              </div>
              <div className="text-right mt-3">
                <button
                  onClick={() => setOpening(null)}
                  className="font-pixel text-[9px] px-3 py-2 bg-[var(--pink-deep)] text-[var(--cream)] border-2 border-[var(--brown)]"
                >
                  ♡ CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
