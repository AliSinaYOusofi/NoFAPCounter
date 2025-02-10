"use client"

import { useEffect, useState } from "react"
import { format, eachDayOfInterval, subYears, startOfWeek, addDays } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, GitCommit } from "lucide-react"

const Tooltip = ({ date, count, children }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute z-10 p-3 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-lg tooltip"
            style={{ width: "200px", left: "50%", transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <GitCommit className="w-4 h-4 mr-2" />
              <span>
                {count} contribution{count !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContributionGraph() {
  const [contributions, setContributions] = useState([])
  const [maxStreak, setMaxStreak] = useState(0)

  useEffect(() => {
    fetchContributions()
  }, [])

  const fetchContributions = async () => {
    try {
      const response = await fetch("/api/streak", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        generateContributionData(data.currentStreak)
      }
    } catch (error) {
      console.error("Error fetching contributions:", error)
    }
  }

  const generateContributionData = (currentStreak) => {
    const endDate = new Date()
    const startDate = subYears(endDate, 1)
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    setMaxStreak(currentStreak)
    setContributions(
      days.map((date) => ({
        date: format(date, "yyyy-MM-dd"),
        count: Math.random() > 0.7 ? Math.floor(Math.random() * currentStreak) : 0,
      })),
    )
  }

  const getContributionColor = (count) => {
    if (count === 0) return "bg-gray-100"
    if (count <= maxStreak * 0.25) return "bg-blue-200"
    if (count <= maxStreak * 0.5) return "bg-blue-300"
    if (count <= maxStreak * 0.75) return "bg-blue-400"
    return "bg-blue-500"
  }

  const generateWeeks = () => {
    const weeks = []
    const firstDay = startOfWeek(subYears(new Date(), 1))

    for (let i = 0; i < 53; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        const day = addDays(firstDay, i * 7 + j)
        const contribution = contributions.find((c) => c.date === format(day, "yyyy-MM-dd"))
        week.push({
          date: format(day, "yyyy-MM-dd"),
          count: contribution ? contribution.count : 0,
        })
      }
      weeks.push(week)
    }
    return weeks
  }

  return (
    <div className="card_bg_top w-full h-full flex items-center justify-center">
      <div className="p-4 bg-black">
        <motion.div
          className="flex gap-1"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.01,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {generateWeeks().map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <Tooltip key={`${weekIndex}-${dayIndex}`} date={day.date} count={day.count}>
                  <motion.div
                    className={`w-3 h-3 rounded-sm ${getContributionColor(day.count)}`}
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: { scale: 1, opacity: 1 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                      mass: 0.5,
                    }}
                    whileHover={{
                      scale: 1.5,
                      transition: { duration: 0.2 },
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex items-center gap-2 mt-4 text-sm text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span>Less</span>
          <div className="flex gap-1 flex-wrap">
            {["bg-gray-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500"].map((color, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-sm ${color}`}
                whileHover={{ scale: 1.5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>
          <span>More</span>
        </motion.div>
      </div>
    </div>
  )
}

