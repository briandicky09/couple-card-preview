import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Typewriter, TypewriterHandle } from "./Typewriter";
import { sfx } from "@/lib/sound";

interface Props {
  text: string;
  speaker?: string;
  onAdvance?: () => void;
  showArrow?: boolean;
}

export function DialogBox({ text, speaker, onAdvance, showArrow = true }: Props) {
  const [done, setDone] = useState(false);
  const tw = useRef<TypewriterHandle>(null);

  const handleClick = () => {
    if (!done) {
      tw.current?.skip();
      sfx.click();
      return;
    }
    sfx.click();
    onAdvance?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="relative w-full max-w-xl text-left bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow px-5 py-4 sm:px-6 sm:py-5 cursor-pointer"
    >
      {speaker && (
        <div className="absolute -top-4 left-4 bg-[var(--sage)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-1 font-pixel text-[10px] text-[var(--brown)]">
          {speaker}
        </div>
      )}
      <p className="font-display text-xl sm:text-2xl leading-snug text-[var(--brown)] min-h-[3em]">
        <Typewriter ref={tw} text={text} speed={32} onDone={() => setDone(true)} />
      </p>
      {!done && (
        <div className="absolute right-4 bottom-3 font-pixel text-[9px] text-[var(--brown)] opacity-70">
          tap to skip ▶▶
        </div>
      )}
      {done && showArrow && (
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute right-4 bottom-3 font-pixel text-[10px] text-[var(--brown)]"
        >
          ▼ click
        </motion.div>
      )}
    </motion.button>
  );
}
