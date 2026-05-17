import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { sfx } from "@/lib/sound";

interface Props {
  stars: number;
  lives: number;
  totalSec: number;
  badges: { name: string; emoji: string }[];
}

export function ShareCard({ stars, lives, totalSec, badges }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    sfx.click();
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#2b2750",
        width: 420,
        height: 560,
      });
      const link = document.createElement("a");
      link.download = `kania-birthday-score.png`;
      link.href = dataUrl;
      link.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    sfx.click();
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#2b2750",
        width: 420,
        height: 560,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "kania-birthday-score.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Sweet Pixel Tale 🎮",
          text: "I finished Kania's birthday game! ♡",
        });
      } else {
        handleSave();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview card (this is what gets screenshot) */}
      <div
        ref={cardRef}
        style={{
          width: 420,
          height: 560,
          background: "linear-gradient(180deg, #2b2750 0%, #3a2a60 60%, #5a4080 100%)",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
          padding: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "100%",
        }}
      >
        {/* Pixel stars decoration */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? 4 : 2,
              height: i % 3 === 0 ? 4 : 2,
              background: "#fff8d6",
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 13 + 3) % 100}%`,
              opacity: 0.4 + (i % 4) * 0.15,
            }}
          />
        ))}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "#f4a8c0",
              marginBottom: 4,
            }}
          >
            ✦ SWEET PIXEL TALE ✦
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 22,
              color: "#fbf3df",
              textShadow: "2px 2px 0 #7d77a6",
              fontWeight: "bold",
            }}
          >
            HAPPY BIRTHDAY
          </div>
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              color: "#f4a8c0",
              marginTop: 4,
            }}
          >
            Kania ♡
          </div>
        </div>

        {/* Stars */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                fontSize: 32,
                filter:
                  i < stars
                    ? "drop-shadow(0 0 8px #fff2b3)"
                    : "grayscale(1) opacity(0.3)",
              }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats box */}
        <div
          style={{
            background: "#fbf3df",
            border: "4px solid #6b4226",
            padding: "12px 20px",
            marginBottom: 16,
            width: "80%",
            boxShadow: "4px 4px 0 #3a2510",
          }}
        >
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: "#6b4226",
              textAlign: "center",
              lineHeight: 2,
            }}
          >
            <div>⏱ TIME: {totalSec.toFixed(1)}s</div>
            <div>♥ HEARTS LEFT: {lives}/3</div>
            <div>🏆 STARS: {stars}/3</div>
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            justifyContent: "center",
            marginBottom: 16,
            width: "90%",
          }}
        >
          {badges.slice(0, 4).map((b) => (
            <div
              key={b.name}
              style={{
                background: "rgba(244,168,192,0.2)",
                border: "2px solid #f4a8c0",
                padding: "4px 10px",
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                color: "#fbf3df",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 12 }}>{b.emoji}</span>
              {b.name}
            </div>
          ))}
        </div>

        {/* Date & URL */}
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 8,
            color: "#fff8d6",
            opacity: 0.5,
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          <div>{dateStr}</div>
          <div>sweet-pixel-tale.briandicky09.workers.dev</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSave}
          disabled={saving}
          className="font-pixel text-[9px] px-4 py-3 bg-[var(--sage)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] hover:bg-[var(--cream)] disabled:opacity-60"
        >
          {saving ? "SAVING..." : saved ? "✓ SAVED!" : "💾 SAVE IMAGE"}
        </motion.button>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShare}
            className="font-pixel text-[9px] px-4 py-3 bg-[var(--pink)] border-4 border-[var(--brown)] pixel-shadow-sm text-[var(--brown)] hover:bg-[var(--pink-deep)] hover:text-[var(--cream)]"
          >
            📤 SHARE
          </motion.button>
        )}
      </div>

      {saved && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-hand text-lg text-[var(--pink)]"
        >
          Score card saved! Send it to Kania~ ♡
        </motion.p>
      )}
    </div>
  );
}
