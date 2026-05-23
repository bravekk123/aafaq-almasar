"use client";

import { motion } from "framer-motion";

interface PremiumButtonProps {
  text: string;
  href: string;
}

export default function PremiumButton({
  text,
  href,
}: PremiumButtonProps) {
  return (
    <motion.a
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      href={href}
      target="_blank"
      className="inline-block bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl text-white text-lg font-black transition shadow-xl"
    >
      {text}
    </motion.a>
  );
}