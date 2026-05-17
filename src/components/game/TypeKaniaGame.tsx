import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { sfx } from "@/lib/sound";

const TARGET = "aku sayang banget sama bobong";

export function TypeKaniaGame({ onDone }: { onDone: (stats: { time: number; ok: boolean }) => void }) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [value, setValue] = useState("");
  const [time, setTime] = useState(0);
  const startRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "play") return;
    startRef.current = performance.now();
    const id = window.setInterval(() => {
      setTime((performance.now() - startRef.current) / 1000);
    }, 100);
    inputRef.current?.focus();
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && value.trim().toLowerCase() === TARGET) {
      const elapsed = (performance.now() - startRef.current) / 1000;
      sfx.correct();
      setPhase("done");
      setTimeout(() => onDone({ time: elapsed, ok: true }), 1100);
    }
  }, [value, phase, onDone]);

  const renderTarget = () => {
    const lower = value.toLowerCase();
    return TARGET.split("").map((c, i) => {
      const typed = i < lower.length;
      const ok = typed && lower[i] === c;
      return (
        <span
          key={i}
          className={
            !typed
              ? "text-[var(--brown)] opacity-40"
              : ok
              ? "text-[var(--sage-deep)]"
              : "text-[var(--pink-deep)] underline"
          }
        >
          {c === " " ? "\u00A0" : c}
        </span>
      );
    });
  };

  return (
    <PixelBackground variant="studio">
      <div className="relative h-full w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220 }}
          className="w-full max-w-lg bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-6 sm:p-8 text-center"
        >
          <div className="font-pixel text-[10px] text-[var(--sage-deep)] mb-2">✦ MINI-GAME ✦</div>
          <h3 className="font-pixel text-base text-[var(--brown)] mb-3">TYPE HIS NAME!</h3>

          {phase === "intro" && (
            <>
              <p className="font-display text-lg text-[var(--brown)] mb-5">
                Type "aku sayang banget sama bobong" as fast as you can ♡
              </p>
              <PixelButton glow onClick={() => { sfx.click(); setPhase("play"); }}>
                ▶ START
              </PixelButton>
            </>
          )}

          {phase === "play" && (
            <>
              <div className="font-pixel text-[9px] sm:text-xs tracking-wide leading-relaxed break-words bg-[var(--beige)] border-4 border-[var(--brown)] p-3 mb-4">
                {renderTarget()}
              </div>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                spellCheck={false}
                className="w-full font-display text-xl text-[var(--brown)] bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 mb-3 outline-none focus:bg-white"
                placeholder="start typing..."
              />
              <div className="font-pixel text-[10px] text-[var(--brown)]">⏱ {time.toFixed(1)}s</div>
            </>
          )}

          {phase === "done" && (
            <>
              <div className="text-5xl mb-2">⌨️💖</div>
              <div className="font-pixel text-sm text-[var(--sage-deep)]">
                NICE! {time.toFixed(1)}s
              </div>
            </>
          )}
        </motion.div>
      </div>
    </PixelBackground>
  );
}
