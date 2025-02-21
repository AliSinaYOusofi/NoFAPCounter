"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, Calendar, Award, X, Check, Target } from "lucide-react"
import Toast from "../global/Toast"

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
}

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
}

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
}

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
}

const Particle = ({ i, color }) => (
  <motion.div className={`absolute w-2 h-2 rounded-full ${color}`} variants={particleVariants} custom={i} />
)

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
}

const determineAchievementType = (daysCompleted) => {
  if (daysCompleted === 1) return "daily"
  if (daysCompleted === 7) return "weekly"
  if (daysCompleted === 30) return "monthly"
  if (daysCompleted === 365) return "yearly"
  return "yearly"
}

export const AchievementAndStreakUpdate = ({ goalName, daysCompleted, onRefresh }) => {
  const [showAnimation, setShowAnimation] = useState(true)
  const [showStreakUpdate, setShowStreakUpdate] = useState(false)
  const [newGoal, setNewGoal] = useState(30)
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
    position: "bottom-right",
  });

  const achievementType = determineAchievementType(daysCompleted)
  const style = achievementStyles[achievementType]
  const Icon = style.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
      setShowStreakUpdate(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async () => {
    setUpdating(true)
    try {
      const response = await fetch("/api/update_current_goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: newGoal }),
      })

      if (response.ok) {
        const data = await response.json()
        setTimeout( () => {
          setNotification({
            show: true,
            message: data?.message || "Goal was updated!",
            type: "success",
            position: "top-center",
          })
          setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }))
          }, 9000)
        })
      } else {
        console.error("Failed to update goal:", response.statusText)
        setError("Failed to update goal. Please try again.")
      }
    } catch (error) {
      setError("Failed to update goal. Please try again.")
    } finally {
      setShowStreakUpdate(false)
      setNewGoal("")
      setError("")
      setUpdating(false)
    }
  }

  const goalOptions = [
    { value: 1, label: "1 day (Trial)" },
    { value: 2, label: "2 days (Getting Started)" },
    { value: 3, label: "3 days (Starter)" },
    { value: 5, label: "5 days (Small Step)" },
    { value: 7, label: "7 days (A Week)" },
    { value: 10, label: "10 days" },
    { value: 14, label: "14 days (Two Weeks)" },
    { value: 21, label: "21 days (Challenge)" },
    { value: 30, label: "30 days (1 Month)" },
    { value: 45, label: "45 days" },
    { value: 60, label: "60 days (2 Months)" },
    { value: 90, label: "90 days (Recommended)" },
    { value: 120, label: "120 days (4 Months)" },
    { value: 180, label: "180 days (6 Months)" },
    { value: 365, label: "365 days (1 Year)" },
  ];
  return (
    <AnimatePresence>
      {(showAnimation || showStreakUpdate) && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {showAnimation && (
            <motion.div
              className={`relative bg-gradient-to-br ${style.gradient} p-8 rounded-2xl shadow-lg text-white text-center max-w-md w-full mx-4`}
            >
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
              {[...Array(20)].map((_, i) => (
                <Particle key={i} i={i} color={style.particleColor} />
              ))}
            </motion.div>
          )}

          {showStreakUpdate && (
            <motion.div
              className="backdrop-blur-3xl bg-black/10 text-white  rounded-lg p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-400">Update Your Streak</h2>
                <button onClick={() => setShowStreakUpdate(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-200 mb-2">
                  Congratulations on reaching {daysCompleted} days! Set a new goal to keep your streak going.
                </p>
                <div className="flex items-center mt-4">
                  <Trophy className="text-yellow-500 mr-2" size={24} />
                  <p className="text-lg  font-semibold text-gray-300">Current Streak: {daysCompleted} days</p>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="goal_days" className="block text-gray-300 text-sm font-bold mb-2">
                  Select New Goal (Days):
                </label>
                <select
                  name="goal_days"
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                  onChange={(e) => setNewGoal(e.target.value)}
                  defaultValue={newGoal}
                  
                >
                  {
                    goalOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.value === daysCompleted}
                      >
                        {option.label}
                      </option>
                  ))}


                </select>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex justify-end">
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md mr-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                >
                  <Check size={20} className="mr-1 inline" />
                  Set New Goal
                  {
                    updating ? <span className="ml-3 loading loading-spinner loading-sm" /> : null
                  }
                </motion.button>
                <motion.button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStreakUpdate(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      <Toast
        show={notification.show}
        message={notification.message}
        type={notification.type}
        position={notification.position}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
    />
    </AnimatePresence>
  )
}

