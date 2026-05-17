import { useMemo } from "react";

interface Props {
  variant?: "day" | "sunset" | "meadow" | "garden" | "studio" | "night";
  children?: React.ReactNode;
}

const palettes = {
  day:    ["#bfe1c7", "#a8d3b3", "#86bf99", "#5e9c79"],
  sunset: ["#f8d6c0", "#f0b8a8", "#d99a9a", "#a87878"],
  meadow: ["#d6e8c2", "#b3d49a", "#86b577", "#578f5a"],
  garden: ["#f3d9e3", "#e6b8c8", "#c894aa", "#9a6c83"],
  studio: ["#d8d2e8", "#b9b0d4", "#9a8fc0", "#6f6394"],
  night:  ["#2b2750", "#3b3868", "#54507f", "#7d77a6"],
};

const skyColors = {
  day:    "linear-gradient(180deg, #cfeaf5 0%, #f3e7c8 100%)",
  sunset: "linear-gradient(180deg, #ffd2a3 0%, #ffb4b4 60%, #f6c6c6 100%)",
  meadow: "linear-gradient(180deg, #d8efff 0%, #f3f3d4 100%)",
  garden: "linear-gradient(180deg, #ffe7f0 0%, #f8e0d0 100%)",
  studio: "linear-gradient(180deg, #e8e3f4 0%, #f5e7d8 100%)",
  night:  "linear-gradient(180deg, #1a1740 0%, #3a2a60 60%, #5a4080 100%)",
};

export function PixelBackground({ variant = "day", children }: Props) {
  const colors = palettes[variant];

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 55,
        delay: Math.random() * 3,
        size: Math.random() > 0.7 ? 4 : 2,
      })),
    [variant],
  );

  // Two parallax layers — far (slow + small) and near (fast + big) for depth.
  const cloudsFar = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        top: 4 + i * 6,
        delay: -i * 22,
        duration: 110 + i * 18,
        scale: 0.45 + Math.random() * 0.25,
        opacity: 0.55,
      })),
    [variant],
  );
  const cloudsNear = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        top: 14 + i * 9,
        delay: -i * 14,
        duration: 55 + i * 12,
        scale: 0.85 + Math.random() * 0.5,
        opacity: 1,
      })),
    [variant],
  );

  const grassBlades = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({ id: i, delay: (i % 7) * 0.2, h: 8 + (i % 5) * 4 })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: skyColors[variant] }}>
      {/* Stars (visible at night/sunset) */}
      {(variant === "night" || variant === "sunset" || variant === "studio") &&
        stars.map((s) => (
          <div
            key={s.id}
            className="absolute animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: variant === "night" ? "#fff8d6" : "#fff",
              animationDelay: `${s.delay}s`,
              boxShadow: variant === "night" ? "0 0 6px #fff8d6" : "none",
            }}
          />
        ))}

      {/* Sun / Moon */}
      <div
        className="absolute rounded-none"
        style={{
          right: "10%",
          top: variant === "night" ? "12%" : "14%",
          width: 64,
          height: 64,
          background: variant === "night" ? "#fff8d6" : variant === "sunset" ? "#ffb070" : "#fff2b3",
          boxShadow:
            variant === "night"
              ? "0 0 32px #fff8d680, inset -8px -8px 0 #d8d2a0"
              : "0 0 48px #fff2b380, inset -8px -8px 0 #f0c878",
          imageRendering: "pixelated",
        }}
      />

      {/* Parallax clouds — far layer (slow) */}
      {variant !== "night" &&
        cloudsFar.map((c) => (
          <div
            key={`f-${c.id}`}
            className="absolute animate-cloud"
            style={{
              top: `${c.top}%`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              transform: `scale(${c.scale})`,
              opacity: c.opacity,
              filter: "blur(0.5px)",
            }}
          >
            <PixelCloud />
          </div>
        ))}
      {/* Parallax clouds — near layer (fast) */}
      {variant !== "night" &&
        cloudsNear.map((c) => (
          <div
            key={`n-${c.id}`}
            className="absolute animate-cloud"
            style={{
              top: `${c.top}%`,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
              transform: `scale(${c.scale})`,
              opacity: c.opacity,
            }}
          >
            <PixelCloud />
          </div>
        ))}
      {/* Drifting stars layer (parallax for night) */}
      {variant === "night" && (
        <div
          className="absolute inset-0 pointer-events-none animate-cloud"
          style={{ animationDuration: "180s" }}
        >
          {stars.slice(0, 14).map((s) => (
            <div
              key={`ds-${s.id}`}
              className="absolute"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: 2,
                height: 2,
                background: "#fff8d6",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Distant hills */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "30%",
          height: "20%",
          background: colors[3],
          clipPath:
            "polygon(0 100%, 0 60%, 8% 50%, 16% 60%, 28% 35%, 40% 55%, 52% 45%, 64% 60%, 76% 40%, 88% 55%, 100% 50%, 100% 100%)",
          opacity: 0.55,
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "25%",
          height: "18%",
          background: colors[2],
          clipPath:
            "polygon(0 100%, 0 70%, 10% 55%, 22% 65%, 34% 50%, 46% 65%, 60% 55%, 72% 70%, 84% 55%, 100% 65%, 100% 100%)",
        }}
      />

      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0" style={{ height: "30%", background: colors[1] }} />
      <div
        className="absolute left-0 right-0"
        style={{ bottom: "30%", height: 8, background: colors[2] }}
      />

      {/* Grass blades */}
      <div className="absolute left-0 right-0 flex items-end" style={{ bottom: "30%", height: 24 }}>
        {grassBlades.map((b) => (
          <div
            key={b.id}
            className="animate-grass mx-[2px]"
            style={{
              width: 3,
              height: b.h,
              background: colors[3],
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <FloatingParticles variant={variant} />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function PixelCloud() {
  return (
    <div className="relative" style={{ width: 96, height: 40 }}>
      {[
        [16, 16, 64, 16],
        [8, 24, 80, 12],
        [24, 8, 48, 12],
      ].map(([x, y, w, h], i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: x,
            top: y,
            width: w,
            height: h,
            background: "#ffffff",
            boxShadow: "0 4px 0 0 #e8e8f0",
          }}
        />
      ))}
    </div>
  );
}

function FloatingParticles({ variant }: { variant: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        size: 3 + Math.random() * 3,
      })),
    [variant],
  );
  const color =
    variant === "night" ? "#fff8d6" : variant === "garden" ? "#f4a8c0" : variant === "studio" ? "#c8b8e8" : "#ffffff";

  return (
    <>
      <style>{`
        @keyframes drift-up {
          0% { transform: translateY(20px); opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: color,
            animation: `drift-up ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      ))}
    </>
  );
}
