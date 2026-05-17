import { motion, AnimatePresence } from "framer-motion";

export function HeartsBar({ lives }: { lives: number }) {
  return (
    <div className="flex gap-2 items-center bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2">
      <span className="font-pixel text-[10px] text-[var(--brown)]">LIVES</span>
      <div className="flex gap-1">
        <AnimatePresence>
          {Array.from({ length: 3 }).map((_, i) => {
            const filled = i < lives;
            return (
              <motion.div
                key={i}
                initial={{ scale: 1 }}
                animate={{ scale: filled ? 1 : 0.7, opacity: filled ? 1 : 0.25 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PixelHeart filled={filled} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PixelHeart({ filled }: { filled: boolean }) {
  // Pixel art heart 7x6
  const grid = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  const fill = filled ? "var(--pink-deep)" : "var(--muted)";
  const highlight = filled ? "var(--pink)" : "transparent";

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(7, 4px)", gap: 0 }}>
      {grid.flat().map((v, idx) => {
        const row = Math.floor(idx / 7);
        const col = idx % 7;
        const isHi = filled && row <= 1 && col <= 2 && v === 1;
        return (
          <div
            key={idx}
            style={{
              width: 4,
              height: 4,
              background: v ? (isHi ? highlight : fill) : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}
