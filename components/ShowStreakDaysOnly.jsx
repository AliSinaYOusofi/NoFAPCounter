"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShowStreakDaysOnly({ streakDays }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const digits = String(streakDays).padStart(3, "0").split("").map(Number);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const digitVariants = {
    hidden: { y: 50, opacity: 0, rotateX: -180 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 2,
      },
    },
  };

  const hoverGlow = {
    hover: {
      scale: 1.1,
      textShadow:
        "0 0 20px rgba(66, 153, 225, 0.8), 0 0 40px rgba(66, 153, 225, 0.6)",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
      {/* 3D Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(66, 153, 225, 0.1), transparent)",
            "radial-gradient(circle at 80% 80%, rgba(255, 105, 180, 0.1), transparent)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Floating 3D Digits */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative z-10"
          >
            <motion.div
              className="text-[20vmin] md:text-[25vmin] font-bold text-blue-400 flex items-center justify-center"
              style={{
                perspective: "1000px",
              }}
            >
              {digits.map((digit, index) => (
                <motion.div
                  key={index}
                  className="relative inline-block mx-[-0.5vmin] md:mx-[-1vmin]"
                  whileHover="hover"
                  variants={hoverGlow}
                >
                  {digit}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-4xl md:text-6xl text-blue-200 mt-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Days Strong
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Update Button */}
      <motion.div
        className="absolute bottom-10 left-0 right-0 flex justify-center z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.button
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05, backgroundColor: "#3182ce" }}
          whileTap={{ scale: 0.95 }}
        >
          Update Streak
        </motion.button>
      </motion.div>

      {/* Particle Effect */}
      {Array.from({ length: 50 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-blue-400 rounded-full z-0"
          variants={particleVariants}
          initial="hidden"
          animate="visible"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Hover-Activated Glow Effect */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(66, 153, 225, 0.1), transparent)",
            "radial-gradient(circle at 80% 80%, rgba(255, 105, 180, 0.1), transparent)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
      />
    </div>
  );
}
