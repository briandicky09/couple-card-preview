import { motion } from "framer-motion";

// Pixel guide "Bobong" — handsome guy, tan/sun-kissed skin, straight black hair, soft smile.
export function PixelGirl({ size = 8 }: { size?: number }) {
  // 12 cols x 16 rows
  // 0=trans 1=skin 2=hair 3=hair-shine 4=shirt 5=shirt-shadow 6=eyes 7=cheek 8=outline 9=mouth 10=neck-shadow
  const map = [
    [0,0,8,8,8,8,8,8,8,8,0,0],
    [0,8,2,2,2,2,2,2,2,2,8,0],
    [8,2,2,3,2,2,2,2,3,2,2,8],
    [8,2,2,2,2,2,2,2,2,2,2,8],
    [8,2,1,1,1,1,1,1,1,1,2,8],
    [8,2,1,6,1,1,1,1,6,1,2,8],
    [8,2,1,1,1,1,1,1,1,1,2,8],
    [8,2,1,7,1,1,1,1,7,1,2,8],
    [8,2,1,1,1,9,9,1,1,1,2,8],
    [8,8,1,1,1,1,1,1,1,1,8,8],
    [0,8,10,1,1,1,1,1,1,10,8,0],
    [0,8,4,4,4,4,4,4,4,4,8,0],
    [8,4,4,4,5,4,4,5,4,4,4,8],
    [8,4,4,4,4,4,4,4,4,4,4,8],
    [8,4,4,4,4,4,4,4,4,4,4,8],
    [0,8,8,4,4,4,4,4,4,8,8,0],
  ];
  const colors: Record<number, string> = {
    0: "transparent",
    1: "#c69472",   // tan/sun-kissed skin
    2: "#1a1018",   // black straight hair
    3: "#3a2640",   // hair shine
    4: "#3d5a80",   // shirt blue
    5: "#2a4060",   // shirt shadow
    6: "#1a0d14",   // eyes
    7: "#a86a52",   // soft cheek shading
    8: "#2a1820",   // outline
    9: "#7a3a30",   // mouth
    10: "#9a6a50",  // neck shadow
  };

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="grid"
      style={{ gridTemplateColumns: `repeat(12, ${size}px)`, gap: 0, filter: "drop-shadow(2px 4px 0 rgba(0,0,0,0.18))" }}
    >
      {map.flat().map((c, i) => (
        <div key={i} style={{ width: size, height: size, background: colors[c] }} />
      ))}
    </motion.div>
  );
}
