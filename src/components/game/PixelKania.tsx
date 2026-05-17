import { motion } from "framer-motion";

// Kania — pixel girl: pale skin, long straight dark-brown hair, soft smile.
// 12 cols x 18 rows (taller for long hair).
export function PixelKania({ size = 8 }: { size?: number }) {
  // 0=trans 1=skin 2=hair 3=hair-shine 4=dress 5=dress-shadow 6=eyes 7=cheek 8=outline 9=mouth 10=neck-shadow 11=bow
  const map = [
    [0,0,8,8,8,8,8,8,8,8,0,0],
    [0,8,2,2,2,11,11,2,2,2,8,0],
    [8,2,2,3,2,2,2,2,3,2,2,8],
    [8,2,2,2,2,2,2,2,2,2,2,8],
    [8,2,1,1,1,1,1,1,1,1,2,8],
    [8,2,1,6,1,1,1,1,6,1,2,8],
    [8,2,1,1,1,1,1,1,1,1,2,8],
    [8,2,1,7,1,1,1,1,7,1,2,8],
    [8,2,1,1,1,9,9,1,1,1,2,8],
    [8,2,1,1,1,1,1,1,1,1,2,8],
    [0,8,10,1,1,1,1,1,1,10,8,0],
    [0,8,4,4,4,4,4,4,4,4,8,0],
    [8,4,4,4,5,4,4,5,4,4,4,8],
    [8,2,4,4,4,4,4,4,4,4,2,8],
    [8,2,4,4,4,4,4,4,4,4,2,8],
    [8,2,2,4,4,4,4,4,4,2,2,8],
    [0,8,2,2,4,4,4,4,2,2,8,0],
    [0,0,8,8,2,2,2,2,8,8,0,0],
  ];
  const colors: Record<number, string> = {
    0: "transparent",
    1: "#fbe3d0",
    2: "#3a2418",
    3: "#5a3828",
    4: "#e89aba",
    5: "#c47898",
    6: "#1a0d14",
    7: "#f0a8b8",
    8: "#2a1820",
    9: "#b8506a",
    10: "#d8b098",
    11: "#f4c8d8",
  };

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      className="grid"
      style={{ gridTemplateColumns: `repeat(12, ${size}px)`, gap: 0, filter: "drop-shadow(2px 4px 0 rgba(0,0,0,0.18))" }}
    >
      {map.flat().map((c, i) => (
        <div key={i} style={{ width: size, height: size, background: colors[c] }} />
      ))}
    </motion.div>
  );
}
