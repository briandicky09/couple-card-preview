import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  glow?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-[var(--sage)] text-[var(--brown)] hover:bg-[var(--sage-deep)] hover:text-[var(--cream)]",
  secondary: "bg-[var(--cream)] text-[var(--brown)] hover:bg-[var(--beige)]",
  danger: "bg-[var(--pink-deep)] text-[var(--cream)] hover:bg-[var(--pink)]",
};

export function PixelButton({ variant = "primary", glow, className = "", children, ...rest }: Props) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ y: 1, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`font-pixel text-xs sm:text-sm px-5 sm:px-7 py-3 sm:py-4 pixel-shadow border-4 border-[var(--brown)] ${variantStyles[variant]} ${glow ? "animate-glow" : ""} ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}
