"use client"

import { useEffect, useState } from "react"
import { format, eachDayOfInterval, subDays } from "date-fns"
import { motion } from "framer-motion"
import { Calendar, GitCommit, ChevronRight, ChevronLeft, Flame, Target } from "lucide-react"
import RetryButton from "./RetryButton"
import  {WeeklyGoalCompletedAnimation}   from "../streak completed anims/WeeklayCompletedAnime"

const Tooltip = ({ date, isStreakDay, streakCount, milestone, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          className="absolute z-10 p-3 text-sm font-medium text-white bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg tooltip"
          style={{
            width: "200px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
            <span>{format(new Date(date), "MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center">
            {isStreakDay ? (
              <Flame className="w-4 h-4 mr-2 text-orange-500" />
            ) : (
              <GitCommit className="w-4 h-4 mr-2 text-gray-400" />
            )}
            <span>
              {isStreakDay ? `Day ${streakCount} of streak` : "Not in streak"}
            </span>
          </div>
          {milestone && (
            <div className="flex items-center mt-2 text-yellow-400">
              <Target className="w-4 h-4 mr-2" />
              <span>{milestone}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default function ContributionGraph() {
  const [contributions, setContributions] = useState([])
  const [maxStreak, setMaxStreak] = useState(0)
  const [startStreakDate, setStartStreakDate] = useState(null)
  const [endStreakDate, setEndStreakDate] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [milestones, setMilestones] = useState([])
  const [goalDays, setGoalDays] = useState(90)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [gaolCompletedAnimation, setGoalCompltedAnimation] = useState(false)

  const generateContributionData = (currentStreak, started_at, updated_at) => {
    const today = new Date();
    const updatedDate = new Date(updated_at);
    const startDate = new Date(started_at);
  
    setStartStreakDate(startDate);
    setEndStreakDate(today);
  
    const days = eachDayOfInterval({ start: startDate, end: today });
    const contributionsData = days.map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const milestone = milestones.find(
        (m) => format(new Date(m.achieved_at), "yyyy-MM-dd") === formattedDate
      );
      const dayDiff = Math.floor((updatedDate - date) / (1000 * 60 * 60 * 24));
      
      const isStreakDay = date <= updatedDate && dayDiff < currentStreak;
      
      const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      
      return {
        date: formattedDate,
        isStreakDay,
        streakCount: isStreakDay ? currentStreak - dayDiff : 0,
        milestone: milestone?.milestone_type
          ? `${milestone.days_reached} Days ${milestone.milestone_type.replace('_', ' ')}`
          : null,
        isToday,
      }
    });
    
    setContributions(contributionsData);
  
    const daysPerPage = 7 * 5;
    const calculatedTotalPages = Math.ceil(contributionsData.length / daysPerPage);
    setTotalPages(calculatedTotalPages)
  }

  const getContributionColor = (isStreakDay, hasMilestone, isToday) => {
    if (hasMilestone) return "bg-yellow-500 ring-2 ring-yellow-400/50"
    else if (isToday && isStreakDay) return 'bg-gradient-to-r from-blue-500 to-green-500';
    else if (isToday && ! isStreakDay) return "bg-blue-500"
    else if (isStreakDay) return "bg-green-500"
    return "bg-gray-800" 
  }

  const daysPerPage = 7 * 5
  const paginatedContributions = contributions.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  )

  const generateWeeks = () => {
    const weeks = []
    if (paginatedContributions.length === 0) return weeks

    const firstDate = new Date(paginatedContributions[0].date)
    const startOffset = firstDate.getDay()
    const paddedContributions = [
      ...Array(startOffset).fill(null),
      ...paginatedContributions
    ]

    const remainder = paddedContributions.length % 7
    if (remainder !== 0) {
      paddedContributions.push(...Array(7 - remainder).fill(null))
    }

    for (let i = 0; i < paddedContributions.length / 7; i++) {
      weeks.push(paddedContributions.slice(i * 7, i * 7 + 7))
    }
    return weeks
  }

  const weeks = generateWeeks()

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  useEffect(() => {
    fetchData()
  }, [refresh])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [streakResponse, milestonesResponse] = await Promise.all([
        fetch("/api/streak", { method: "POST" }),
        fetch("/api/milestones")
      ])

      const [streakData, milestonesData] = await Promise.all([
        streakResponse.json(),
        milestonesResponse.json()
      ])

      if (streakData.success) {
        setMaxStreak(streakData.currentStreak)
        setGoalDays(streakData.goal_days || 90)
        generateContributionData(streakData.currentStreak, streakData.started_at, streakData?.updated_at)
      }

      if (milestonesData.success) {
        setMilestones(milestonesData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error?.message || "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center"> 
        <span className="loading loading-spinner"> </span> 
      </div>
    )
  }

  if (error) {
    return (
        <div className="w-screen h-screen flex-col flex items-center justify-center bg-black">
            <p className="text-red-500">Error: {error}</p>
            <RetryButton setRefresh={setRefresh} />
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <WeeklyGoalCompletedAnimation daysCompleted={maxStreak}/> 
      <div className="w-full mt-10 max-w-xl md:max-w-6xl mx-auto bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
        
        <div className="flex  items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Streak Calendar</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">Goal: {goalDays} days</div>
            <div className="text-sm text-gray-400">Progress: {Math.round((maxStreak / goalDays) * 100)}%</div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-gray-700">
            {startStreakDate && endStreakDate && (
              <>
                {format(new Date(startStreakDate), "MMMM d, yyyy")} -{" "}
                {format(new Date(endStreakDate), "MMMM d, yyyy")}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
              className="p-2 rounded-full border border-gray-400 cursor-pointer group transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white" />
            </button>
            <span className="text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full border border-gray-400 cursor-pointer group  transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-gray-300  group-hover:text-white" />
            </button>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
            {weeks.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div key={`${weekIndex}-${dayIndex}`} className="flex justify-center">
                  {day ? (
                    <Tooltip
                      date={day.date}
                      isStreakDay={day.isStreakDay}
                      streakCount={day.streakCount}
                      milestone={day.milestone}
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-full ${getContributionColor(
                          day.isStreakDay,
                          day.milestone,
                          day.isToday,
                          day.isToday && day.isStreakDay,
                        )}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.1,
                          delay: (weekIndex * 7 + dayIndex) * 0.02,
                        }}
                        whileHover={{ scale: 1.2 }}
                      />
                    </Tooltip>
                  ) : (
                    <div className="w-8 h-8" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-wrap md:flex-row flex-col">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-500" />
              <span className="text-sm text-gray-400">Streak Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-yellow-500 ring-2 ring-yellow-400/50" />
              <span className="text-sm text-gray-400">Milestone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-sm text-gray-400">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500" />
              <span className="text-sm text-gray-400">Today + StreakDay</span>
            </div>
          </div>
          <div className="md:text-lg text-sm font-bold text-white">Current Streak: {maxStreak} days</div>
        </div>
      </div>
    </div>
  )
}
