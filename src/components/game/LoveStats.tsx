import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const START = new Date("2025-02-05T00:00:00");

interface Stats {
  daysTogether: number;
  wishes: number;
  petPets: number;
  petFeeds: number;
  flowers: number;
  lettersUnlocked: number;
  highScore: number;
}

function readStats(): Stats {
  const safeParse = <T,>(k: string, fallback: T): T => {
    try {
      const r = localStorage.getItem(k);
      return r ? (JSON.parse(r) as T) : fallback;
    } catch {
      return fallback;
    }
  };
  const days = Math.floor((Date.now() - START.getTime()) / 86400000);
  const wishes = safeParse<unknown[]>("kania-wish-jar", []).length;
  const pet = safeParse<{ pets?: number; feeds?: number }>("kania-pixel-pet", {});
  const garden = safeParse<{ flowers?: unknown[] }>("kania-pixel-garden", {});
  const vault = safeParse<{ unlocked?: number }>("kania-letter-vault", {});
  const highScore = parseInt(localStorage.getItem("kania-high-score") || "0", 10);

  return {
    daysTogether: days,
    wishes,
    petPets: pet.pets || 0,
    petFeeds: pet.feeds || 0,
    flowers: garden.flowers?.length || 0,
    lettersUnlocked: vault.unlocked || 0,
    highScore,
  };
}

export function LoveStats() {
  const [s, setS] = useState<Stats>(readStats);

  useEffect(() => {
    const id = setInterval(() => setS(readStats()), 1500);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "DAYS TOGETHER", value: s.daysTogether, emoji: "💞", c: "var(--pink-deep)" },
    { label: "WISHES MADE", value: s.wishes, emoji: "🌟", c: "var(--sage-deep)" },
    { label: "PET LOVES", value: s.petPets, emoji: "🐱", c: "var(--pink-deep)" },
    { label: "FEEDS", value: s.petFeeds, emoji: "🍣", c: "var(--sage-deep)" },
    { label: "FLOWERS", value: s.flowers, emoji: "🌸", c: "var(--pink-deep)" },
    { label: "LETTERS", value: s.lettersUnlocked, emoji: "💌", c: "var(--sage-deep)" },
  ];

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4">
      <div className="font-pixel text-[10px] text-[var(--pink-deep)] mb-3 text-center">
        📊 LOVE STATS DASHBOARD
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--beige)]/40 border-2 border-[var(--brown)] p-2 text-center"
          >
            <div className="text-lg">{it.emoji}</div>
            <div
              className="font-pixel text-base"
              style={{ color: it.c }}
            >
              {it.value}
            </div>
            <div className="font-pixel text-[7px] text-[var(--brown)]/70 mt-1">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
      {s.highScore > 0 && (
        <div className="mt-3 text-center font-pixel text-[9px] text-[var(--brown)]">
          🏆 HIGH SCORE: <span className="text-[var(--pink-deep)]">{s.highScore}</span>
        </div>
      )}
    </div>
  );
}
