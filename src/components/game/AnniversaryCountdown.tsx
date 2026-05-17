import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ANNIV_MONTH = 1; // Feb (0-indexed)
const ANNIV_DAY = 5;

function nextAnniv(): Date {
  const now = new Date();
  const y = now.getFullYear();
  const cand = new Date(y, ANNIV_MONTH, ANNIV_DAY, 0, 0, 0);
  if (cand.getTime() <= now.getTime()) {
    return new Date(y + 1, ANNIV_MONTH, ANNIV_DAY, 0, 0, 0);
  }
  return cand;
}

function diff(target: Date) {
  const ms = target.getTime() - Date.now();
  const total = Math.max(0, ms);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return { d, h, m, s };
}

export function AnniversaryCountdown() {
  const [target] = useState(nextAnniv());
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value: number }[] = [
    { label: "DAYS", value: t.d },
    { label: "HRS", value: t.h },
    { label: "MIN", value: t.m },
    { label: "SEC", value: t.s },
  ];

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-[var(--pink)]/60 to-[var(--sage)]/40 border-4 border-[var(--brown)] pixel-shadow-sm p-4 text-center relative overflow-hidden">
      {/* sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-xs"
          style={{ left: `${(i * 13) % 100}%`, top: `${(i * 23) % 80}%` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
        >
          ✦
        </motion.span>
      ))}

      <div className="relative">
        <div className="font-pixel text-[9px] text-[var(--sage-deep)] mb-1">
          ⏳ COUNTDOWN TO 5 FEB
        </div>
        <div className="font-hand text-lg text-[var(--brown)] mb-3">
          our next anniversary ♡
        </div>
        <div className="grid grid-cols-4 gap-2">
          {units.map((u) => (
            <div
              key={u.label}
              className="bg-[var(--cream)] border-2 border-[var(--brown)] py-2"
            >
              <motion.div
                key={u.value}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-pixel text-base sm:text-lg text-[var(--pink-deep)]"
              >
                {String(u.value).padStart(2, "0")}
              </motion.div>
              <div className="font-pixel text-[7px] text-[var(--brown)]/70 mt-1">
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
