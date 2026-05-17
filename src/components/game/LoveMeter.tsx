import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { sfx } from "@/lib/sound";

export function LoveMeter() {
  const [value, setValue] = useState(1000);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    sfx.click();
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fbf3df",
      });
      const link = document.createElement("a");
      link.download = `bobong-loves-kania-${value}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const intensity = Math.min(1, value / 1500);

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-3">
      <div
        ref={cardRef}
        className="w-full bg-[#fbf3df] border-4 border-[var(--brown)] pixel-shadow p-5 text-center"
      >
        <div className="font-pixel text-[10px] text-[var(--sage-deep)] mb-2">
          ✦ LOVE METER ✦
        </div>
        <motion.div
          key={value}
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 240 }}
          className="font-pixel text-xl sm:text-2xl text-[var(--pink-deep)] mb-2"
        >
          BOBONG LOVES KANIA
        </motion.div>
        <motion.div
          key={`v-${value}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-pixel text-3xl sm:text-5xl text-[var(--brown)] mb-3"
          style={{ filter: `drop-shadow(0 0 ${intensity * 14}px var(--pink-deep))` }}
        >
          {value}%
        </motion.div>
        <div className="relative h-5 w-full bg-[var(--cream)] border-2 border-[var(--brown)] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--pink)] to-[var(--pink-deep)]"
            animate={{ width: `${Math.min(100, (value / 1500) * 100)}%` }}
            transition={{ type: "spring", stiffness: 180 }}
          />
        </div>
        <div className="flex justify-center gap-1 mt-2 text-xl">
          {Array.from({ length: Math.max(1, Math.round(intensity * 5)) }).map((_, i) => (
            <span key={i}>💖</span>
          ))}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={1500}
        step={10}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        className="w-full accent-[var(--pink-deep)]"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="font-pixel text-[10px] px-4 py-3 bg-[var(--sage)] text-[var(--brown)] border-4 border-[var(--brown)] pixel-shadow-sm disabled:opacity-60"
      >
        {saving ? "SAVING..." : "📸 SCREENSHOT LOVE METER"}
      </button>
    </div>
  );
}
