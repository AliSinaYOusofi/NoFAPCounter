"use client";

import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

const flashVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 0.8, 0.2, 0.9, 0],
    transition: {
      duration: 1.5,
      times: [0, 0.1, 0.3, 0.5, 1],
      ease: "easeInOut",
    },
  },
};

const lightningVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: [0, 1, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      times: [0, 0.5, 1],
      ease: "easeInOut",
    },
  },
};

export const LightningEffect = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-30 backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Flash overlay */}
      <motion.div
        className="absolute inset-0 bg-blue-500"
        variants={flashVariants}
        initial="hidden"
        animate="visible"
      />
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="bolt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" /> {/* blue-300 */}
            <stop offset="50%" stopColor="#3B82F6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#1D4ED8" /> {/* blue-700 */}
          </linearGradient>
        </defs>
        {/* Primary lightning bolt */}
        <motion.path
          d="M40 0 L60 40 L30 50 L70 100"
          stroke="url(#bolt-gradient)"
          strokeWidth="4"
          fill="none"
          filter="url(#glow)"
          variants={lightningVariants}
          initial="hidden"
          animate="visible"
        />
        {/* Secondary lightning bolt */}
        <motion.path
          d="M60 0 L40 45 L70 55 L30 100"
          stroke="url(#bolt-gradient)"
          strokeWidth="3"
          fill="none"
          filter="url(#glow)"
          variants={lightningVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
    </motion.div>
  );
};
