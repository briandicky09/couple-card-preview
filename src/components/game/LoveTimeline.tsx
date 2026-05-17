import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Milestone {
  date: string;
  title: string;
  emoji: string;
  story: string;
}

const MILESTONES: Milestone[] = [
  {
    date: "2024-11-20",
    title: "First Meeting",
    emoji: "✨",
    story: "the first time our worlds crossed — a small moment that changed everything.",
  },
  {
    date: "2025-01-15",
    title: "First Date",
    emoji: "☕",
    story: "two coffees, a thousand things to say, and not enough hours.",
  },
  {
    date: "2025-02-05",
    title: "Made it Official ♡",
    emoji: "💍",
    story: "the day i became yours, and you became mine. forever the 5th.",
  },
  {
    date: "2025-04-14",
    title: "First Trip Together",
    emoji: "🧳",
    story: "we got lost on purpose. best detour of my life.",
  },
  {
    date: "2025-08-08",
    title: "Half-Year ♡",
    emoji: "🌙",
    story: "six little months that already felt like a lifetime of love.",
  },
  {
    date: "2026-02-05",
    title: "First Anniversary",
    emoji: "🎂",
    story: "one full trip around the sun, holding hands the whole way.",
  },
];

export function LoveTimeline() {
  const [active, setActive] = useState<number | null>(2);

  return (
    <div className="w-full max-w-md bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm p-4">
      <div className="font-pixel text-[10px] text-[var(--pink-deep)] mb-3 text-center">
        ✦ OUR LOVE STORY ✦
      </div>

      <div className="relative pl-6">
        {/* vertical line */}
        <div className="absolute left-2 top-1 bottom-1 w-1 bg-[var(--brown)]" />

        {MILESTONES.map((m, i) => {
          const isActive = active === i;
          return (
            <div key={m.date} className="relative mb-2">
              <button
                onClick={() => setActive(isActive ? null : i)}
                className="w-full flex items-center gap-3 text-left"
              >
                <span
                  className="absolute -left-5 w-4 h-4 border-2 border-[var(--brown)]"
                  style={{
                    background: isActive ? "var(--pink-deep)" : "var(--sage)",
                  }}
                />
                <span className="text-xl">{m.emoji}</span>
                <span className="flex-1">
                  <span className="block font-pixel text-[9px] text-[var(--brown)]/70">
                    {new Date(m.date).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="block font-pixel text-[10px] text-[var(--pink-deep)]">
                    {m.title}
                  </span>
                </span>
              </button>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-8 mt-1 mb-2 font-hand text-base text-[var(--brown)] bg-[var(--pink)]/25 border-2 border-dashed border-[var(--brown)] px-3 py-2">
                      "{m.story}"
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
