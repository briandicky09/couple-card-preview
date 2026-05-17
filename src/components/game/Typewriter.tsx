import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { sfx } from "@/lib/sound";

interface Props {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
  cursor?: boolean;
  sound?: boolean;
}

export interface TypewriterHandle {
  skip: () => void;
  isDone: () => boolean;
}

// Reusable typing animation. Parents can call `ref.skip()` to fast-forward.
export const Typewriter = forwardRef<TypewriterHandle, Props>(function Typewriter(
  { text, speed = 32, className, onDone, cursor = true, sound = true },
  ref,
) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown("");
    setDone(false);
    let i = 0;
    let cancelled = false;
    const id = window.setInterval(() => {
      if (cancelled) return;
      i++;
      setShown(text.slice(0, i));
      if (sound && i % 2 === 0) sfx.type();
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useImperativeHandle(ref, () => ({
    skip: () => {
      if (done) return;
      setShown(text);
      setDone(true);
      onDone?.();
    },
    isDone: () => done,
  }));

  return (
    <span className={className}>
      {shown}
      {cursor && !done && (
        <span className="inline-block w-[0.5em] h-[1em] ml-1 bg-current align-middle animate-pulse" />
      )}
    </span>
  );
});
