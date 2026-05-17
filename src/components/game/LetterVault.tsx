import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/lib/sound";

const KEY = "kania-letter-vault";

const LETTERS = [
  {
    title: "Letter #1 — For The Day You Found Me",
    body:
      "kania, kalau kamu lagi baca ini berarti aku berhasil bikin sesuatu buat kamu. kamu itu alasan kenapa aku percaya hal-hal kecil bisa terasa besar.",
  },
  {
    title: "Letter #2 — On Rainy Days",
    body:
      "kalau hujan, ingat ini: aku selalu jadi atap kamu. pelukan virtual jam berapapun, asal kamu minta.",
  },
  {
    title: "Letter #3 — When You Feel Tired",
    body:
      "tarik napas, mata kamu yang lelah itu masih jadi pemandangan favorit aku. istirahat dulu, aku tunggu.",
  },
  {
    title: "Letter #4 — A Tiny Promise",
    body:
      "aku janji satu hal kecil: aku akan tetap di sini, di percakapan jam 11 malam, di tawa konyol, di hari-hari biasa kamu.",
  },
  {
    title: "Letter #5 — Forever Bobong's",
    body:
      "kalau dunia minta aku pilih satu orang yang aku tunggu di setiap akhir cerita — itu kamu, kania, selalu kamu.",
  },
];

interface VaultState {
  unlocked: number; // count
  lastVisit: string | null;
}

function load(): VaultState {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return { unlocked: 1, lastVisit: null };
}

const today = () => new Date().toISOString().slice(0, 10);

export function LetterVault() {
  const [state, setState] = useState<VaultState>(load);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    setState((s) => {
      if (s.lastVisit !== today() && s.unlocked < LETTERS.length) {
        const next = { unlocked: s.unlocked + 1, lastVisit: today() };
        localStorage.setItem(KEY, JSON.stringify(next));
        return next;
      }
      if (s.lastVisit !== today()) {
        const next = { ...s, lastVisit: today() };
        localStorage.setItem(KEY, JSON.stringify(next));
        return next;
      }
      return s;
    });
  }, []);

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4">
      <div className="font-pixel text-[10px] text-[var(--pink-deep)] mb-3 text-center">
        💌 LETTER VAULT — {state.unlocked}/{LETTERS.length} UNLOCKED
      </div>

      <div className="grid grid-cols-1 gap-2">
        {LETTERS.map((l, i) => {
          const locked = i >= state.unlocked;
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => {
                sfx.click();
                setOpen(i);
              }}
              className={`flex items-center gap-3 px-3 py-2 border-2 border-[var(--brown)] pixel-shadow-sm text-left ${
                locked ? "bg-[var(--beige)]/60 opacity-70" : "bg-[var(--pink)]/40 hover:bg-[var(--pink)]/60"
              }`}
            >
              <span className="text-xl">{locked ? "🔒" : "💌"}</span>
              <span className="flex-1 font-pixel text-[9px] text-[var(--brown)]">
                {locked ? `Letter #${i + 1} — locked` : l.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 font-pixel text-[8px] text-[var(--brown)]/70 text-center">
        ✦ a new letter unlocks every day you visit ✦
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#fbf3df] border-4 border-[var(--brown)] pixel-shadow p-5"
            >
              <div className="font-pixel text-[10px] text-[var(--pink-deep)] mb-2">
                {LETTERS[open].title}
              </div>
              <p className="font-hand text-xl text-[var(--brown)] leading-snug whitespace-pre-line">
                {LETTERS[open].body}
              </p>
              <div className="text-right mt-3 font-hand text-lg text-[var(--sage-deep)]">— bobong ♡</div>
              <button
                onClick={() => setOpen(null)}
                className="mt-3 w-full font-pixel text-[10px] px-3 py-2 bg-[var(--sage)] text-[var(--brown)] border-2 border-[var(--brown)] pixel-shadow-sm"
              >
                ✕ CLOSE LETTER
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
