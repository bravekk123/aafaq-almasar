"use client";

import { motion } from "framer-motion";

interface PremiumCardProps {
  title: string;
  description: string;
}

export default function PremiumCard({
  title,
  description,
}: PremiumCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
      }}
      className="bg-white text-black rounded-3xl p-10 shadow-2xl hover:shadow-green-500/20"
    >

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>

      <h3 className="text-3xl font-black mb-5">
        {title}
      </h3>

      <p className="text-gray-600 leading-loose">
        {description}
      </p>

    </motion.div>
  );
}