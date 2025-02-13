"use client";

import { useEffect, useState } from "react";
import {
  format,
  eachDayOfInterval,
  subYears,
  startOfWeek,
  addDays,
  subDays,
} from "date-fns";
import { motion } from "framer-motion";
import { Calendar, GitCommit } from "lucide-react";

const Tooltip = ({ date, count, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          className="absolute z-10 p-3 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-lg tooltip"
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
    </div>
  );
};

export default function ContributionGraph() {
  const [contributions, setContributions] = useState([]);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startStreakDate, setStartStreakDate] = useState(null);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const response = await fetch("/api/streak", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMaxStreak(data.currentStreak);
        generateContributionData(data.currentStreak, data.updated_at);
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
    }
  };

  const generateContributionData = (currentStreak, lastUpdated) => {
    const endDate = new Date();
    const startDate = subYears(endDate, 3);

    const streakEnd = new Date(lastUpdated);
    const streakStart = subDays(streakEnd, currentStreak - 1);
    setStartStreakDate(streakStart); // Save the start of the streak

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    setContributions(
      days.map((date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        const isStreakDay = date >= streakStart && date <= streakEnd;
        return {
          date: formattedDate,
          count: isStreakDay ? 1 : 0,
        };
      })
    );
  };

  const getContributionColor = (count) => {
    return count > 0 ? "bg-blue-500" : "bg-gray-500";
  };

  // Generate weeks from the contributions. Each week is an array of day objects.
  const generateWeeks = () => {
    const weeks = [];
    const startingDate = startStreakDate ? new Date(startStreakDate) : new Date();
    const firstDay = startOfWeek(startingDate);

    for (let i = 0; i < 53; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const day = addDays(firstDay, i * 7 + j);
        const contribution = contributions.find(
          (c) => c.date === format(day, "yyyy-MM-dd")
        );
        week.push({
          date: format(day, "yyyy-MM-dd"),
          count: contribution ? contribution.count : 0,
        });
      }
      weeks.push(week);
    }
    return weeks;
  };

  // Compute weeks once for both the month labels and the grid.
  const weeks = generateWeeks();

  // Build the month labels without repeating a month within the same year.
  let lastMonthYear = "";
  const monthLabels = weeks.map((week, weekIndex) => {
    const weekStartDate = new Date(week[0].date);
    const currentMonthYear = format(weekStartDate, "yyyy-MM");
    let label = "";
    // Label if it's the first week or if the month-year changes.
    if (weekIndex === 0 || currentMonthYear !== lastMonthYear) {
      label = format(weekStartDate, "MMM");
      lastMonthYear = currentMonthYear;
    }
    return (
      <div key={weekIndex} className="w-3 text-xs text-gray-500 text-center">
        {label}
      </div>
    );
  });

  return (
    <div className="card_bg_top w-full h-full flex flex-col items-center justify-center">
      <div className="p-4">
        {/* Month Labels */}
        <div className="flex mb-2">{monthLabels}</div>

        {/* Contribution Graph Grid */}
        <motion.div
          className="flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <Tooltip
                  key={`${weekIndex}-${dayIndex}`}
                  date={day.date}
                  count={day.count}
                >
                  <motion.div
                    className={`w-3 h-3 rounded-sm ${getContributionColor(
                      day.count
                    )}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.2 }}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          className="flex items-center gap-2 mt-4 text-sm text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <span>Less</span>
          <div className="flex gap-1">
            {[
              "bg-gray-100",
              "bg-blue-200",
              "bg-blue-300",
              "bg-blue-400",
              "bg-blue-500",
            ].map((color, index) => (
              <div key={index} className={`w-3 h-3 rounded-sm ${color}`} />
            ))}
          </div>
          <span>More</span>
        </motion.div>
      </div>
    </div>
  );
}
