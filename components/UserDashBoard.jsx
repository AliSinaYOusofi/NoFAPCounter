"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Award, Calendar, Clock, MessageSquare, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { QuoteShower } from "./QuoteShower"
import { useToken } from "@/hooks/useToken"

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
    className="p-6 border card_bg_bottom border-gray-800 rounded-xl bg-black shadow-lg flex flex-col items-center text-center hover:border-gray-700 transition duration-300"
  >
    <div className="mb-3 text-blue-500">{icon}</div>
    <span className="text-sm font-medium text-gray-400">{label}</span>
    <p className="text-lg font-bold text-white mt-1">{value}</p>
  </motion.div>
)

export function UserDashBoard() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const token = useToken()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("/api/user_data", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUserData(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, token])

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  const daysSinceStart = Math.floor((new Date() - new Date(userData?.startDate || new Date())) / (1000 * 60 * 60 * 24))

  const DASHBOARD_ITEMS = [
    {
      icon: <User size={24} />,
      label: "Username",
      value: userData.username,
    },
    {
      icon: <Calendar size={24} />,
      label: "Start Date",
      value: new Date(userData.startDate).toLocaleDateString(),
    },
    {
      icon: <Award size={24} />,
      label: "Current Streak",
      value: `${userData.currentStreak} days`,
    },
    {
      icon: <Clock size={24} />,
      label: "Days Since Start",
      value: `${daysSinceStart} days`,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-black p-6">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {DASHBOARD_ITEMS.map((item, index) => (
              <DashboardCard key={index} {...item} />
            ))}
          </AnimatePresence>
        </div>
        <motion.div variants={cardVariants} className="mt-8 card_bg_right p-6 border border-gray-800 rounded-xl bg-black shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare size={24} className="text-blue-500" />
            <span className="text-lg font-semibold text-white">Motivational Message</span>
          </div>
          <p className="text-gray-300 italic text-center ">
            "{userData.motivationalMessage || "Stay strong and keep going!"}"
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 border card_bg_top border-gray-800 rounded-xl p-6 bg-black shadow-lg"
        >
          <QuoteShower />
        </motion.div>
      </motion.div>
    </div>
  )
}

