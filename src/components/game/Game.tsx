import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { PixelBackground } from "./PixelBackground";
import { PixelButton } from "./PixelButton";
import { PixelGirl } from "./PixelGirl";
import { PixelKania } from "./PixelKania";
import { MusicPlayer } from "./MusicPlayer";

import { DialogBox } from "./DialogBox";
import { QuestionScene, QuestionData } from "./QuestionScene";
import { LetterScene } from "./LetterScene";
import { HeartCatchGame } from "./HeartCatchGame";
import { TypeKaniaGame } from "./TypeKaniaGame";
import { DatePuzzle } from "./DatePuzzle";
import { BirthdayCandles } from "./BirthdayCandles";
import { MemoryReel } from "./MemoryReel";
import { AnniversaryCounter } from "./AnniversaryCounter";
import { ShareCard } from "./ShareCard";
import { WishJar } from "./WishJar";
import { LoveMeter } from "./LoveMeter";
import { DailyQuote } from "./DailyQuote";
import { PixelPet } from "./PixelPet";
import { PixelGarden } from "./PixelGarden";
import { LoveTimeline } from "./LoveTimeline";
import { LetterVault } from "./LetterVault";
import { AnniversaryCountdown } from "./AnniversaryCountdown";
import { LoveStats } from "./LoveStats";

import { FutureLetter } from "./FutureLetter";

import { sfx, startBgm, stopBgm } from "@/lib/sound";

type Phase =
  | "opening"
  | "curtain"
  | "guide"
  | "questions"
  | "minigame"
  | "ending"
  | "letter"
  | "candles"
  | "memory"
  | "gameover";

const QUESTIONS: QuestionData[] = [
  {
    bg: "meadow",
    question: "Who is your boyfriend?",
    options: ["Taemin", "Bobong"],
    correct: 1,
    rewardTitle: "Here's a star for you ⭐",
    rewardEmoji: "⭐",
    rewardKind: "star",
  },
  {
    bg: "garden",
    question: "When did we start dating?",
    options: ["5 February", "I forgot, help me think"],
    correct: 0,
    rewardTitle: "You got a flower 🌸",
    rewardEmoji: "🌸",
    rewardKind: "flower",
  },
  {
    bg: "studio",
    question: "Is your most handsome boyfriend right now Bobong?",
    options: ["Yes", "Maybe, yes", "I think, yes", "Definitely"],
    correct: -1,
    rewardTitle: "You unlocked our song 🎵",
    rewardEmoji: "🎵",
    rewardKind: "music",
  },
  {
    bg: "sunset",
    question: "How much do you love Bobong?",
    options: ["So much", "A lot", "Infinitely", "All of the above"],
    correct: -1,
    rewardTitle: "You unlocked a special puzzle! 🧩",
    rewardEmoji: "🧩",
    rewardKind: "star",
  },
];

const DIALOGS = [
  "Hi, Kania ♡",
  "Welcome to your very own little pixel world!",
  "Today is a special day... it's YOUR day ♡",
  "I made this tiny adventure just for you.",
  "There will be four small questions waiting ahead.",
  "You have three hearts — be careful with them, okay?",
  "Take a deep breath, smile a little... and let's begin!",
  "Goodluck, my love. Have fun ♡",
];

interface MiniStats {
  hearts?: { caught: number; time: number };
  typing?: { time: number; ok: boolean };
  puzzle?: { time: number; ok: boolean };
}

const PROGRESS_KEY = "kania-game-progress";
const COMPLETIONS_KEY = "kania-game-completions";

interface SavedProgress {
  phase: Phase;
  dialogIdx: number;
  qIdx: number;
  miniIdx: number;
  lives: number;
  startTime: number | null;
  endTime: number | null;
  mini: MiniStats;
}

function loadProgress(): SavedProgress | null {
  try {
    const r = localStorage.getItem(PROGRESS_KEY);
    if (r) return JSON.parse(r) as SavedProgress;
  } catch {}
  return null;
}

function loadCompletions(): number {
  try {
    const r = localStorage.getItem(COMPLETIONS_KEY);
    if (r) return parseInt(r, 10) || 0;
  } catch {}
  return 0;
}

export function Game() {
  const saved = typeof window !== "undefined" ? loadProgress() : null;
  const [phase, setPhase] = useState<Phase>(saved?.phase ?? "opening");
  const [dialogIdx, setDialogIdx] = useState(saved?.dialogIdx ?? 0);
  const [qIdx, setQIdx] = useState(saved?.qIdx ?? 0);
  const [miniIdx, setMiniIdx] = useState(saved?.miniIdx ?? 0);
  const [lives, setLives] = useState(saved?.lives ?? 3);
  const [startTime, setStartTime] = useState<number | null>(saved?.startTime ?? null);
  const [endTime, setEndTime] = useState<number | null>(saved?.endTime ?? null);
  const [mini, setMini] = useState<MiniStats>(saved?.mini ?? {});
  const [completions] = useState<number>(() =>
    typeof window !== "undefined" ? loadCompletions() : 0,
  );
  const canSkip = completions > 0;

  const skipToEnd = () => {
    sfx.click();
    setEndTime(performance.now());
    setPhase("ending");
  };

  // Persist progress to localStorage on every relevant change
  useEffect(() => {
    try {
      const payload: SavedProgress = {
        phase,
        dialogIdx,
        qIdx,
        miniIdx,
        lives,
        startTime,
        endTime,
        mini,
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
    } catch {}
  }, [phase, dialogIdx, qIdx, miniIdx, lives, startTime, endTime, mini]);

  useEffect(() => {
    if (phase === "ending") sfx.win();
  }, [phase]);

  useEffect(() => () => stopBgm(), []);

  const restart = () => {
    sfx.click();
    setLives(3);
    setQIdx(0);
    setMiniIdx(0);
    setDialogIdx(0);
    setStartTime(null);
    setEndTime(null);
    setMini({});
    setPhase("opening");
    try {
      localStorage.removeItem(PROGRESS_KEY);
    } catch {}
  };


  const advanceAfterQuestion = () => {
    if (qIdx + 1 < QUESTIONS.length) {
      setMiniIdx(qIdx);
      setPhase("minigame");
    } else {
      setEndTime(performance.now());
      setPhase("ending");
    }
  };

  // ── Score & badges ───────────────────────────────────────
  const result = useMemo(() => {
    const totalSec =
      startTime && endTime ? Math.max(1, (endTime - startTime) / 1000) : 0;

    let stars = 1;
    if (lives === 3) stars++;
    if (totalSec > 0 && totalSec < 90) stars++;
    stars = Math.min(3, stars);

    const badges: { name: string; emoji: string; desc: string }[] = [];
    if (lives === 3) badges.push({ name: "Heart Collector", emoji: "💗", desc: "Finished without losing a heart" });
    if (totalSec > 0 && totalSec < 75) badges.push({ name: "Speed Lover", emoji: "⚡", desc: "Lightning fast through the journey" });
    if (mini.hearts && mini.hearts.caught >= 8) badges.push({ name: "Cupid's Aim", emoji: "🏹", desc: "Caught every falling heart" });
    if (mini.typing && mini.typing.time < 8) badges.push({ name: "Sweet Talker", emoji: "💌", desc: "Typed her name in a heartbeat" });
    if (mini.puzzle && mini.puzzle.ok) badges.push({ name: "Memory Keeper", emoji: "🧩", desc: "Remembered all our special moments" });
    if (stars === 3) badges.push({ name: "Perfect Run", emoji: "👑", desc: "A flawless little adventure" });
    if (badges.length === 0) badges.push({ name: "True Romantic", emoji: "🌹", desc: "You made it to the end ♡" });

    let endingTitle = "CONGRATULATIONS ♡";
    let endingSubtitle = "you finished the game, Kania";
    let endingTone: "legendary" | "great" | "sweet" = "sweet";
    if (stars === 3) {
      endingTitle = "LEGENDARY LOVE ♡";
      endingSubtitle = "a flawless run — the universe approves of us";
      endingTone = "legendary";
    } else if (stars === 2) {
      endingTitle = "SWEET VICTORY ♡";
      endingSubtitle = "you danced through every moment so beautifully";
      endingTone = "great";
    } else {
      endingTitle = "FOREVER MINE ♡";
      endingSubtitle = "stars or no stars, you're still my favorite ending";
    }

    return { totalSec, stars, badges, endingTitle, endingSubtitle, endingTone };
  }, [startTime, endTime, lives, mini]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden scanlines">
      <MusicPlayer className="absolute top-3 right-3" />

      <AnimatePresence mode="wait">
        {phase === "opening" && (
          <motion.div
            key="opening"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <PixelBackground variant="day">
              <div className="h-full w-full flex flex-col items-center justify-center px-4 text-center">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  className="mb-3 font-pixel text-[9px] sm:text-xs text-[var(--sage-deep)] tracking-widest"
                >
                  ✦ THANK YOU FOR REACHING LEVEL 20 ✦
                </motion.div>
                <motion.h1
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 220 }}
                  className="font-pixel text-2xl sm:text-5xl text-[var(--pink-deep)] text-pixel-shadow leading-tight mb-3"
                >
                  HAPPY BIRTHDAY
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="font-hand text-2xl sm:text-4xl text-[var(--brown)] mb-10"
                >
                  Kania the Little Journey
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="w-full"
                >
                  <DailyQuote />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                >
                  <PixelButton
                    glow
                    onClick={() => {
                      sfx.click();
                      startBgm();
                      setPhase("curtain");
                    }}
                  >
                    ▶ START
                  </PixelButton>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-6 font-pixel text-[9px] text-[var(--brown)] opacity-70"
                >
                  press start to begin ♡
                </motion.div>
              </div>
            </PixelBackground>
          </motion.div>
        )}

        {phase === "curtain" && (
          <motion.div
            key="curtain"
            className="absolute inset-0 z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            onAnimationComplete={() => setTimeout(() => setPhase("guide"), 1400)}
          >
            <PixelBackground variant="meadow" />
            <motion.div
              className="absolute inset-y-0 left-0 w-1/2 bg-[var(--brown)] z-50"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--brown) 0 18px, #5a3520 18px 36px)",
              }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 w-1/2 bg-[var(--brown)] z-50"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--brown) 0 18px, #5a3520 18px 36px)",
              }}
            />
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: 4,
                  height: 4,
                  background: "#fff2b3",
                  zIndex: 51,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 2, 0] }}
                transition={{ duration: 1, delay: 0.6 + Math.random() * 0.6 }}
              />
            ))}
          </motion.div>
        )}

        {phase === "guide" && (
          <motion.div
            key="guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <PixelBackground variant="meadow">
              <div className="h-full w-full flex flex-col items-center justify-end pb-12 sm:pb-20 px-4 gap-6">
                <motion.div
                  key={dialogIdx}
                  initial={{ y: 0, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mb-2 flex items-end gap-4 sm:gap-8"
                >
                  <PixelGirl size={10} />
                  <AnimatePresence>
                    {[0, 2, 6, 7].includes(dialogIdx) && (
                      <motion.div
                        key="kania"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 40, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                      >
                        <PixelKania size={10} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <DialogBox
                  key={`d-${dialogIdx}`}
                  text={DIALOGS[dialogIdx]}
                  speaker={[0, 2, 6, 7].includes(dialogIdx) ? "BOBONG → KANIA" : "BOBONG"}
                  onAdvance={() => {
                    if (dialogIdx + 1 < DIALOGS.length) setDialogIdx(dialogIdx + 1);
                    else {
                      setStartTime(performance.now());
                      setPhase("questions");
                    }
                  }}
                />
              </div>
            </PixelBackground>
          </motion.div>
        )}

        {phase === "questions" && (
          <motion.div
            key={`q-${qIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <QuestionScene
              data={QUESTIONS[qIdx]}
              index={qIdx}
              total={QUESTIONS.length}
              lives={lives}
              onCorrect={() => {}}
              onWrong={() => {
                const next = lives - 1;
                setLives(next);
                if (next <= 0) setTimeout(() => setPhase("gameover"), 800);
              }}
              onNext={advanceAfterQuestion}
            />
          </motion.div>
        )}

        {phase === "minigame" && (
          <motion.div
            key={`m-${miniIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {miniIdx === 0 ? (
              <HeartCatchGame
                onDone={(stats) => {
                  setMini((m) => ({ ...m, hearts: stats }));
                  setQIdx(qIdx + 1);
                  setPhase("questions");
                }}
              />
            ) : miniIdx === 1 ? (
              <TypeKaniaGame
                onDone={(stats) => {
                  setMini((m) => ({ ...m, typing: stats }));
                  setQIdx(qIdx + 1);
                  setPhase("questions");
                }}
              />
            ) : (
              <DatePuzzle
                onDone={(stats) => {
                  setMini((m) => ({ ...m, puzzle: stats }));
                  setQIdx(qIdx + 1);
                  setPhase("questions");
                }}
              />
            )}
          </motion.div>
        )}

        {phase === "ending" && (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <PixelBackground variant="night">
              <div className="h-full w-full overflow-y-auto px-4 py-8 sm:py-10">
                <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-start text-center">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{ y: "100vh", x: `${(i / 12) * 100}%`, opacity: 0 }}
                    animate={{ y: "-20vh", opacity: [0, 1, 0] }}
                    transition={{ duration: 8 + i, repeat: Infinity, delay: i * 0.5 }}
                  >
                    ♡
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
                  className="font-pixel text-[10px] text-[var(--pink)] mb-3"
                >
                  ✦ THE END ✦
                </motion.div>
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="font-pixel text-2xl sm:text-5xl text-[var(--cream)] text-pixel-shadow mb-2"
                >
                  {result.endingTitle}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-hand text-2xl sm:text-3xl text-[var(--pink)] mb-4"
                >
                  {result.endingSubtitle}
                </motion.p>

                {/* Anniversary counter */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mb-4"
                >
                  <AnniversaryCounter />
                </motion.div>

                {/* Stars */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                  className="flex gap-3 mb-4"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2 + i * 0.25, type: "spring", stiffness: 220 }}
                      className="text-4xl sm:text-5xl"
                      style={{
                        filter: i < result.stars ? "drop-shadow(0 0 10px #fff2b3)" : "grayscale(1) opacity(0.35)",
                      }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="font-pixel text-[10px] text-[var(--cream)] mb-5"
                >
                  TIME {result.totalSec.toFixed(1)}s · HEARTS {lives}/3
                </motion.div>

                {/* Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.0 }}
                  className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4"
                >
                  {result.badges.map((b, i) => (
                    <motion.div
                      key={b.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 2.1 + i * 0.15 }}
                      className="flex items-center gap-3 bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-3 py-2 text-left"
                    >
                      <span className="text-2xl">{b.emoji}</span>
                      <div>
                        <div className="font-pixel text-[10px] text-[var(--pink-deep)]">{b.name}</div>
                        <div className="font-display text-sm text-[var(--brown)] leading-tight">{b.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Share card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4 }}
                  className="mb-4 w-full max-w-md"
                >
                  <ShareCard
                    stars={result.stars}
                    lives={lives}
                    totalSec={result.totalSec}
                    badges={result.badges}
                  />
                </motion.div>

                {/* Love Meter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <LoveMeter />
                </motion.div>

                {/* Wish Jar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <WishJar />
                </motion.div>

                {/* Anniversary Countdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.65 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <AnniversaryCountdown />
                </motion.div>

                {/* Love Story Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.7 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <LoveTimeline />
                </motion.div>

                {/* Pixel Pet */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.72 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <PixelPet />
                </motion.div>

                {/* Pixel Garden */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.74 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <PixelGarden />
                </motion.div>

                {/* Letter Vault */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.76 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <LetterVault />
                </motion.div>

                {/* Love Stats Dashboard */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.78 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <LoveStats />
                </motion.div>

                {/* Future Letter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.82 }}
                  className="mb-4 w-full flex justify-center"
                >
                  <FutureLetter />
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.8 }}
                  className="flex flex-wrap gap-3 justify-center"
                >
                  <PixelButton
                    glow
                    onClick={() => {
                      sfx.click();
                      setPhase("candles");
                    }}
                  >
                    🕯️ BLOW THE CANDLES
                  </PixelButton>
                  <PixelButton
                    onClick={() => {
                      sfx.click();
                      setPhase("letter");
                    }}
                  >
                    💌 OPEN FINAL GIFT
                  </PixelButton>
                </motion.div>
                </div>
              </div>
            </PixelBackground>
          </motion.div>
        )}

        {phase === "letter" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <LetterScene onRestart={restart} onMemory={() => { sfx.click(); setPhase("memory"); }} />
          </motion.div>
        )}

        {phase === "candles" && (
          <motion.div
            key="candles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <BirthdayCandles onDone={() => { sfx.click(); setPhase("letter"); }} />
          </motion.div>
        )}

        {phase === "memory" && (
          <motion.div
            key="memory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <MemoryReel onDone={() => { sfx.click(); setPhase("letter"); }} />
          </motion.div>
        )}

        {phase === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <PixelBackground variant="night">
              <div className="absolute inset-0 bg-black/60" />
              {Array.from({ length: 60 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    width: 3,
                    height: 12,
                    background: "#7d77a6",
                  }}
                  initial={{ y: "-10vh" }}
                  animate={{ y: "110vh" }}
                  transition={{
                    duration: 1.2 + Math.random() * 1.5,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear",
                  }}
                />
              ))}
              <div className="relative h-full w-full flex flex-col items-center justify-center px-4 text-center z-10">
                <motion.h1
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className="font-pixel text-3xl sm:text-5xl text-[var(--pink)] text-pixel-shadow mb-4"
                >
                  GAME OVER
                </motion.h1>
                <p className="font-hand text-2xl text-[var(--cream)] mb-8">
                  don't worry, love stories deserve second chances
                </p>
                <PixelButton variant="danger" glow onClick={restart}>
                  ↻ TRY AGAIN
                </PixelButton>
              </div>
            </PixelBackground>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

