import { useMemo } from "react";

// Start of relationship: 5 February 2025
const START_DATE = new Date("2025-02-05T00:00:00");

export function AnniversaryCounter() {
  const stats = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - START_DATE.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const nextAnniv = new Date(START_DATE);
    nextAnniv.setFullYear(now.getFullYear());
    if (nextAnniv <= now) nextAnniv.setFullYear(now.getFullYear() + 1);
    const daysToAnniv = Math.ceil(
      (nextAnniv.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    return { diffDays, daysToAnniv };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
      {/* Days together */}
      <div className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-4 py-2 text-center">
        <div className="font-pixel text-[8px] text-[var(--brown)] opacity-60 mb-1">
          TOGETHER FOR
        </div>
        <div className="font-pixel text-base text-[var(--pink-deep)] text-pixel-shadow-sm">
          {stats.diffDays} days
        </div>
        <div className="font-hand text-sm text-[var(--brown)]">
          ♡
        </div>
      </div>

      {/* Days until anniversary */}
      <div className="bg-[var(--cream)] border-4 border-[var(--brown)] pixel-shadow-sm px-4 py-2 text-center">
        <div className="font-pixel text-[8px] text-[var(--brown)] opacity-60 mb-1">
          ANNIVERSARY IN
        </div>
        <div className="font-pixel text-base text-[var(--sage-deep)] text-pixel-shadow-sm">
          {stats.daysToAnniv} days
        </div>
        <div className="font-hand text-sm text-[var(--brown)]">
          5 Feb ✦
        </div>
      </div>
    </div>
  );
}
