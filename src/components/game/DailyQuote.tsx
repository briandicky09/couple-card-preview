import { motion } from "framer-motion";

const QUOTES = [
  "Kalau hujan punya alasan jatuh, alasanku adalah kamu, Kania.",
  "Cinta itu sederhana — sesederhana namamu di setiap doaku.",
  "Tiap pagi terasa istimewa, karena tahu kamu masih jadi milikku.",
  "Bintang di langit banyak, tapi cuma kamu yang aku ingat namanya.",
  "Pelangi datang setelah hujan, kamu datang setelah aku berdoa.",
  "Hatiku pixel kecil, tapi semuanya berbentuk wajahmu.",
  "Kalau rindu bisa diukur, jariku tak cukup untuk menghitungnya.",
  "Dunia ini ramai, tapi tenang sekali kalau ada kamu di sebelah.",
  "Aku bukan penyair, tapi untuk kamu — semua kata jadi puisi.",
  "Senyummu itu cheat code paling manjur buat hariku.",
  "Aku cinta kamu hari ini, kemarin, dan setiap save file yang ada.",
  "Kamu adalah level terbaik dalam hidupku, Kania ♡",
  "Walau aku cuma karakter pixel, cintaku ke kamu HD 4K.",
  "Setiap detak jantungku punya checkpoint bernama Kania.",
];

export function DailyQuote() {
  const now = new Date();
  const dayIndex = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const quote = QUOTES[dayIndex % QUOTES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mx-auto max-w-md bg-[var(--cream)]/90 border-4 border-[var(--brown)] pixel-shadow-sm px-4 py-3 mb-5"
    >
      <div className="font-pixel text-[8px] text-[var(--sage-deep)] mb-1 tracking-widest">
        ✦ QUOTE HARI INI ✦
      </div>
      <div className="font-hand text-lg sm:text-xl text-[var(--brown)] leading-tight">
        "{quote}"
      </div>
    </motion.div>
  );
}
