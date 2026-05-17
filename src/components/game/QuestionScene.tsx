import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { HeartsBar } from "./HeartsBar";
import { PixelConfetti } from "./Confetti";
import { Typewriter, TypewriterHandle } from "./Typewriter";
import { sfx } from "@/lib/sound";

export interface QuestionData {
  bg: "day" | "sunset" | "meadow" | "garden" | "studio" | "night";
  question: string;
  options: string[];
  correct: number;
  rewardTitle: string;
  rewardEmoji: string;
  rewardKind: "star" | "flower" | "music";
}

interface Props {
  data: QuestionData;
  index: number;
  total: number;
  lives: number;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
}

export function QuestionScene({ data, index, total, lives, onCorrect, onWrong, onNext }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "wrong" | "correct">("idle");
  const [shaking, setShaking] = useState(false);
  const [questionDone, setQuestionDone] = useState(false);
  const twRef = useRef<TypewriterHandle>(null);

  const handlePick = (i: number) => {
    if (state === "correct" || !questionDone) return;
    sfx.click();
    setPicked(i);
    const isCorrect = data.correct === -1 || i === data.correct;
    if (isCorrect) {
      setState("correct");
      sfx.correct();
      onCorrect();
    } else {
      setState("wrong");
      setShaking(true);
      sfx.wrong();
      onWrong();
      setTimeout(() => setShaking(false), 600);
    }
  };

  const dismissWrong = () => {
    sfx.click();
    setPicked(null);
    setState("idle");
  };

  return (
    <PixelBackground variant={data.bg}>
      <div className="relative h-full w-full flex flex-col">
        {/* HUD */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 font-pixel text-[10px] text-[var(--brown)]">
            Q {index + 1} / {total}
          </div>
          <HeartsBar lives={lives} />
        </div>

        {/* Question card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            key={index}
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={shaking ? { x: [-10, 10, -8, 8, 0] } : { scale: 1, opacity: 1, y: 0 }}
            transition={shaking ? { duration: 0.45, ease: "easeInOut" } : { type: "spring", stiffness: 200, damping: 18 }}
            className="w-full max-w-2xl bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <div className="font-pixel text-[10px] text-[var(--sage-deep)] mb-3">♡ QUESTION ♡</div>
              <h2 className="font-pixel text-base sm:text-2xl text-[var(--brown)] leading-relaxed min-h-[3em]">
                <Typewriter
                  ref={twRef}
                  key={data.question}
                  text={data.question}
                  speed={45}
                  onDone={() => setQuestionDone(true)}
                />
              </h2>
              {!questionDone && (
                <button
                  onClick={() => { sfx.click(); twRef.current?.skip(); }}
                  className="mt-3 font-pixel text-[9px] px-3 py-2 bg-[var(--beige)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] hover:bg-[var(--sage)]"
                >
                  SKIP ▶▶
                </button>
              )}
            </div>
            <AnimatePresence>
              {questionDone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {data.options.map((opt, i) => {
                const isWrong = state === "wrong" && picked === i;
                const isRight = state === "correct" && picked === i;
                return (
                  <motion.button
                    key={i}
                    whileHover={state === "idle" ? { y: -3, scale: 1.02 } : {}}
                    whileTap={state === "idle" ? { scale: 0.97 } : {}}
                    onClick={() => handlePick(i)}
                    disabled={state !== "idle"}
                    className={`font-pixel text-[11px] sm:text-sm px-4 py-5 border-4 border-[var(--brown)] pixel-shadow-sm text-left transition-colors ${
                      isWrong
                        ? "bg-[var(--pink-deep)] text-[var(--cream)]"
                        : isRight
                        ? "bg-[var(--sage)] text-[var(--brown)]"
                        : "bg-[var(--beige)] text-[var(--brown)] hover:bg-[var(--sage)]"
                    }`}
                  >
                    <span className="mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.button>
                );
              })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <div className="h-20" />

        <AnimatePresence>
          {state === "wrong" && <WrongPopup onClose={dismissWrong} livesLeft={lives} />}
          {state === "correct" && (
            <CorrectPopup data={data} onNext={onNext} isLast={index + 1 === total} />
          )}
        </AnimatePresence>
      </div>
    </PixelBackground>
  );
}

function WrongPopup({ onClose, livesLeft }: { onClose: () => void; livesLeft: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      {/* falling broken-heart pixels */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          style={{ left: `${Math.random() * 100}%` }}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.4, ease: "linear" }}
        >
          💔
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.4, y: 40, rotate: -6 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.4, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-6 sm:p-7 text-center max-w-xs w-full"
      >
        {/* ribbon label */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--pink-deep)] border-4 border-[var(--brown)] pixel-shadow-sm px-4 py-1 font-pixel text-[10px] text-[var(--cream)] whitespace-nowrap">
          ✦ OOPSIE ✦
        </div>

        <motion.div
          animate={{ rotate: [-8, 8, -6, 6, 0], y: [0, -4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-3 inline-block"
        >
          💔
        </motion.div>

        <div className="font-pixel text-sm text-[var(--pink-deep)] text-pixel-shadow-sm mb-2">
          WRONG ANSWER!
        </div>
        <p className="font-display text-xl text-[var(--brown)] leading-snug mb-4">
          That's not it, sweetheart...<br />try again ♡
        </p>

        <div className="flex items-center justify-center gap-1 mb-4 font-pixel text-[9px] text-[var(--brown)]">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={i < livesLeft ? "text-[var(--pink-deep)]" : "opacity-25"}>
              ♥
            </span>
          ))}
          <span className="ml-2">{livesLeft} left</span>
        </div>

        <motion.button
          whileHover={{ y: -2, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="font-pixel text-[11px] px-5 py-3 bg-[var(--pink-deep)] text-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm hover:bg-[var(--pink)] hover:text-[var(--brown)]"
        >
          ↻ TRY AGAIN
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function CorrectPopup({
  data,
  onNext,
  isLast,
}: {
  data: QuestionData;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
    >
      <PixelConfetti count={data.rewardKind === "music" ? 80 : 60} />
      <motion.div
        initial={{ scale: 0.4, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="relative bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow p-6 sm:p-8 text-center max-w-sm w-full"
      >
        <RewardArt kind={data.rewardKind} />
        <div className="font-pixel text-xs text-[var(--sage-deep)] mt-4 mb-2">CORRECT!</div>
        <div className="font-display text-2xl text-[var(--brown)] mb-5 min-h-[2em]">
          <Typewriter key={data.rewardTitle} text={data.rewardTitle} speed={28} />
        </div>
        <PixelButton onClick={() => { sfx.click(); onNext(); }} glow>
          {isLast ? "FINISH ♡" : "NEXT ➤"}
        </PixelButton>
      </motion.div>
    </motion.div>
  );
}

function RewardArt({ kind }: { kind: "star" | "flower" | "music" }) {
  if (kind === "star") {
    return (
      <div className="relative h-24 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.15, 1] }}
          transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
          className="text-7xl"
          style={{ filter: "drop-shadow(0 0 12px #fff2b3)" }}
        >
          ⭐
        </motion.div>
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-xl"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos((i / 6) * Math.PI * 2) * 60,
              y: Math.sin((i / 6) * Math.PI * 2) * 60,
            }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
          >
            ✦
          </motion.span>
        ))}
      </div>
    );
  }
  if (kind === "flower") {
    return (
      <div className="relative h-24 flex items-center justify-center">
        <motion.div animate={{ scale: [0.6, 1.1, 1] }} transition={{ duration: 1, ease: "backOut" }} className="text-7xl">
          🌸
        </motion.div>
        {["🌸", "🌺", "💐", "🌷", "🌼"].map((f, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -80 - i * 10, x: (i - 2) * 30, rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          >
            {f}
          </motion.span>
        ))}
      </div>
    );
  }
  return (
    <div className="relative h-24 flex items-center justify-center">
      <div className="bg-[var(--brown)] border-4 border-[var(--brown)] px-4 py-2 flex items-end gap-1 h-16">
        {[8, 14, 10, 16, 12, 18, 9].map((h, i) => (
          <motion.div
            key={i}
            className="w-2 bg-[var(--sage)]"
            animate={{ height: [h, h * 1.8, h] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
            style={{ height: h }}
          />
        ))}
      </div>
      {["♪", "♫", "♬", "♩"].map((n, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl text-[var(--pink-deep)]"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -70 - i * 10, x: (i - 1.5) * 35 }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
        >
          {n}
        </motion.span>
      ))}
    </div>
  );
}
