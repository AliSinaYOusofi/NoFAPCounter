"use client"

import { useEffect, useState, useCallback } from "react"
import { Award, Calendar, Clock, MessageSquare, User, Target, Trophy, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { QuoteShower } from "./QuoteShower"
import RetryButton from "./global/RetryButton"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const DashboardCard = ({ icon, label, value }) => (
  <motion.div
    variants={cardVariants}
    className="p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl flex flex-col items-center text-center hover:border-blue-500 transition duration-300 shadow-lg hover:shadow-blue-500/20"
  >
    <div className="mb-3 text-blue-400">{icon}</div>
    <span className="text-sm font-medium text-gray-400">{label}</span>
    <p className="text-lg font-bold text-white mt-1">{value}</p>
  </motion.div>
)

export function UserDashBoard() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refresh, setRefresh] = useState(false)

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/user_data", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()
      setUserData(data)
      console.log("data", data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-b from-gray-900 to-black w-full flex items-center justify-center">
        <span className="loading loading-spinner text-white"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <RetryButton setRefresh={setRefresh} />
      </div>
    )
  }

  const daysSinceStart = Math.floor((new Date() - new Date(userData?.started_at || new Date())) / (1000 * 60 * 60 * 24))

  const DASHBOARD_ITEMS = [
    { icon: <User size={24} />, label: "Username", value: userData.username },
    { icon: <Zap size={24} />, label: "Current Streak", value: `${userData.currentStreak} days` },
    { icon: <Trophy size={24} />, label: "Longest Streak", value: `${userData.longestStreak} days` },
    { icon: <Target size={24} />, label: "Goal", value: `${userData.goal_days} days` },
    { icon: <Calendar size={24} />, label: "Start Date", value: new Date(userData.started_at).toLocaleDateString() },
    { icon: <Clock size={24} />, label: "Days Since Start", value: `${daysSinceStart} days` },
    { icon: <Award size={24} />, label: "Total Clean Days", value: `${userData.totalCleanDays} days` },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black p-6 text-white">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">Your Journey Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {DASHBOARD_ITEMS.map((item, index) => (
              <DashboardCard key={index} {...item} />
            ))}
          </AnimatePresence>
        </div>

        {/* Motivational Message Card */}
        <motion.div
          variants={cardVariants}
          className="mt-8 p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare size={24} className="text-blue-400" />
            <span className="text-lg font-semibold text-white">Today's Motivation</span>
          </div>
          <p className="text-gray-300 italic text-center text-lg">
            "{userData.motivationalMessage || "Stay strong and keep going!"}"
          </p>
        </motion.div>

        {/* Streak History */}
        {userData.streakHistory && userData.streakHistory.length > 0 && (
          <motion.div
            variants={cardVariants}
            className="mt-8 p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Recent History</h2>
            <div className="space-y-2">
              {userData.streakHistory.map((log, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-gray-300 bg-gray-700/50 p-3 rounded-lg"
                >
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      log.status === "clean" ? "bg-green-500 text-green-900" : "bg-red-500 text-red-900"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 shadow-lg"
        >
          <QuoteShower />
        </motion.div>
      </motion.div>
    </div>
  )
}

