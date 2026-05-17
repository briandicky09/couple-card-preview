import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/sound";

const KEY = "kania-pixel-garden";
const FLOWERS = ["🌸", "🌷", "🌹", "🌻", "🌼", "💐", "🪻", "🥀"];

interface Flower {
  emoji: string;
  date: string;
  x: number;
  y: number;
}

interface GardenState {
  flowers: Flower[];
  lastPlanted: string | null;
}

function load(): GardenState {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return { flowers: [], lastPlanted: null };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function PixelGarden() {
  const [state, setState] = useState<GardenState>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const canPlant = state.lastPlanted !== today();

  const plant = () => {
    if (!canPlant) return;
    sfx.correct();
    const f: Flower = {
      emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
      date: today(),
      x: Math.random() * 88 + 2,
      y: Math.random() * 60 + 20,
    };
    setState((s) => ({
      flowers: [...s.flowers, f],
      lastPlanted: today(),
    }));
  };

  const streak = useMemo(() => state.flowers.length, [state.flowers]);

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-pixel text-[10px] text-[var(--sage-deep)]">🌱 PIXEL GARDEN</div>
        <div className="font-pixel text-[8px] text-[var(--brown)]/70">{streak} bloom{streak !== 1 ? "s" : ""}</div>
      </div>

      <div
        className="relative h-40 w-full border-2 border-[var(--brown)] overflow-hidden mb-3"
        style={{
          background:
            "linear-gradient(to bottom, #cfe7f5 0%, #cfe7f5 55%, #a8d3b3 55%, #87b894 100%)",
        }}
      >
        {/* sun */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#fff2b3] border-2 border-[var(--brown)] rounded-full" />
        {/* flowers */}
        {state.flowers.map((f, i) => (
          <motion.div
            key={`${f.date}-${i}`}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: i * 0.02 }}
            className="absolute text-xl"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            title={f.date}
          >
            {f.emoji}
          </motion.div>
        ))}
        {state.flowers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center font-hand text-lg text-[var(--brown)]/70">
            an empty little garden... plant your first flower ♡
          </div>
        )}
      </div>

      <button
        onClick={plant}
        disabled={!canPlant}
        className="w-full font-pixel text-[10px] px-3 py-3 bg-[var(--sage)] text-[var(--brown)] border-2 border-[var(--brown)] pixel-shadow-sm disabled:opacity-50"
      >
        {canPlant ? "🌱 PLANT TODAY'S FLOWER" : "✓ ALREADY PLANTED TODAY — COME BACK TOMORROW"}
      </button>
    </div>
  );
}
