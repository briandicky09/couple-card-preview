import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startBgm, stopBgm, setMuted } from "@/lib/sound";

// ── Replace the URL below with your YouTube embed URL ──────────
// Format: "https://www.youtube.com/embed/VIDEO_ID?autoplay=1&loop=1&playlist=VIDEO_ID"
const OUR_SONG_URL = "https://www.youtube.com/embed/5-rbSNzU_b8?autoplay=1&loop=1&playlist=5-rbSNzU_b8";
const OUR_SONG_TITLE = "Our Song ♡";

type MusicMode = "pixel" | "oursong" | "off";

interface Props {
  className?: string;
}

export function MusicPlayer({ className = "" }: Props) {
  const [mode, setMode] = useState<MusicMode>("pixel");
  const [showMenu, setShowMenu] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (mode === "pixel") {
      setMuted(false);
      startBgm();
    } else if (mode === "oursong") {
      stopBgm();
      setMuted(true);
    } else {
      stopBgm();
      setMuted(true);
    }
  }, [mode]);

  const label = mode === "pixel" ? "🎵" : mode === "oursong" ? "🎶" : "🔇";

  return (
    <div className={`relative z-[100] ${className}`}>
      {/* Toggle button */}
      <button
        onClick={() => setShowMenu((s) => !s)}
        className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm w-10 h-10 font-pixel text-[10px] text-[var(--brown)] hover:bg-[var(--pink)]"
        aria-label="music options"
      >
        {label}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow min-w-[160px] z-50"
          >
            <div className="font-pixel text-[8px] text-[var(--brown)] opacity-50 px-3 pt-2 pb-1">
              MUSIC
            </div>

            <button
              onClick={() => { setMode("pixel"); setShowMenu(false); }}
              className={`w-full text-left px-3 py-2 font-pixel text-[9px] text-[var(--brown)] hover:bg-[var(--sage)] flex items-center gap-2 ${
                mode === "pixel" ? "bg-[var(--beige)]" : ""
              }`}
            >
              🎵 Pixel BGM
              {mode === "pixel" && <span className="ml-auto">✓</span>}
            </button>

            {OUR_SONG_URL && (
              <button
                onClick={() => { setMode("oursong"); setShowMenu(false); }}
                className={`w-full text-left px-3 py-2 font-pixel text-[9px] text-[var(--brown)] hover:bg-[var(--sage)] flex items-center gap-2 ${
                  mode === "oursong" ? "bg-[var(--beige)]" : ""
                }`}
              >
                🎶 {OUR_SONG_TITLE}
                {mode === "oursong" && <span className="ml-auto">✓</span>}
              </button>
            )}

            {!OUR_SONG_URL && (
              <div className="px-3 py-2 font-pixel text-[8px] text-[var(--brown)] opacity-40">
                🎶 Our Song<br />
                <span className="opacity-60">(set URL in MusicPlayer.tsx)</span>
              </div>
            )}

            <button
              onClick={() => { setMode("off"); setShowMenu(false); }}
              className={`w-full text-left px-3 py-2 font-pixel text-[9px] text-[var(--brown)] hover:bg-[var(--pink)] flex items-center gap-2 border-t-2 border-[var(--brown)] ${
                mode === "off" ? "bg-[var(--beige)]" : ""
              }`}
            >
              🔇 Mute
              {mode === "off" && <span className="ml-auto">✓</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden YouTube iframe — only active when mode is oursong */}
      {OUR_SONG_URL && mode === "oursong" && (
        <iframe
          ref={iframeRef}
          src={OUR_SONG_URL}
          allow="autoplay"
          style={{
            position: "fixed",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
            bottom: 0,
            right: 0,
            border: "none",
          }}
          title="our song"
        />
      )}
    </div>
  );
}
