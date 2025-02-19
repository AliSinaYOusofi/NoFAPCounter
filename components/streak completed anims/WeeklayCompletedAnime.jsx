"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Calendar, Award, X } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { when: "afterChildren" },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  exit: { y: -20, opacity: 0 },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { scale: 0, rotate: 180 },
};

const particleVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: (i) => ({
    opacity: [0, 1, 0],
    y: [0, -100 - Math.random() * 50],
    x: [0, (Math.random() - 0.5) * 200],
    transition: {
      duration: 1.5 + Math.random(),
      times: [0, 0.2, 1],
      repeat: Number.POSITIVE_INFINITY,
      delay: i * 0.1,
    },
  }),
};

const Particle = ({ i, color }) => (
  <motion.div
    className={`absolute w-2 h-2 rounded-full ${color}`}
    variants={particleVariants}
    custom={i}
  />
);

const achievementStyles = {
  daily: {
    gradient: "from-blue-500 to-blue-700",
    icon: Trophy,
    iconColor: "text-yellow-400",
    particleColor: "bg-yellow-400",
    title: "Daily Goal Achieved!",
  },
  weekly: {
    gradient: "from-green-500 to-green-700",
    icon: Star,
    iconColor: "text-yellow-300",
    particleColor: "bg-yellow-300",
    title: "Weekly Milestone Reached!",
  },
  monthly: {
    gradient: "from-purple-500 to-purple-700",
    icon: Calendar,
    iconColor: "text-indigo-300",
    particleColor: "bg-indigo-300",
    title: "Monthly Target Accomplished!",
  },
  yearly: {
    gradient: "from-red-500 to-red-700",
    icon: Award,
    iconColor: "text-gold-400",
    particleColor: "bg-gold-400",
    title: "Yearly Triumph Unlocked!",
  },
};

const determineAchievementType = (daysCompleted) => {
  if (daysCompleted === 1) return "daily";
  if (daysCompleted === 7) return "weekly";
  if (daysCompleted === 30) return "monthly";
  if (daysCompleted === 365) return "yearly";
  if (daysCompleted < 7) return "daily";
  if (daysCompleted < 30) return "weekly";
  if (daysCompleted < 365) return "monthly";
  return "yearly";
};

export const WeeklyGoalCompletedAnimation = ({ goalName, daysCompleted }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const achievementType = determineAchievementType(daysCompleted);
  const style = achievementStyles[achievementType];
  const Icon = style.icon;

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 50000);
    return () => clearTimeout(timer);
  }, [showAnimation]);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={`relative bg-gradient-to-br ${style.gradient} p-8 rounded-2xl shadow-lg text-white text-center max-w-md w-full mx-4`}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setShowAnimation(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div variants={iconVariants}>
              <Icon className={`w-24 h-24 mx-auto ${style.iconColor}`} />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mt-4 mb-2">
              {style.title}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl mb-4">
              {goalName}
            </motion.p>
            <motion.p variants={itemVariants} className="text-lg mb-6">
              You've maintained your streak for {daysCompleted} {daysCompleted === 1 ? "day" : "days"}!
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-8 h-8 ${style.iconColor} fill-current`} />
              ))}
            </motion.div>
            <motion.button
              variants={itemVariants}
              className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
              onClick={() => setShowAnimation(false)}
            >
              Continue
            </motion.button>
          </motion.div>
          {[...Array(20)].map((_, i) => (
            <Particle key={i} i={i} color={style.particleColor} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};