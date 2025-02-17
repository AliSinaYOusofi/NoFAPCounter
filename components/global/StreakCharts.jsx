"use client";

import { useEffect, useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";
import { Calendar, Trophy, Target, Clock, Star, Award, Zap, Flag, Flame } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StreakCharts() {
  const [userData, setUserData] = useState(null);
  const [streakLogs, setStreakLogs] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [streakResponse, logsResponse, milestonesResponse] = await Promise.all([
        fetch("/api/streak", { method: "POST" }),
        fetch("/api/streak_logs"),
        fetch("/api/milestones")
      ]);

      const [streakData, logsData, milestonesData] = await Promise.all([
        streakResponse.json(),
        logsResponse.json(),
        milestonesResponse.json()
      ]);

      if (streakData.success && logsData.success && milestonesData.success) {
        setUserData(streakData);
        setStreakLogs(logsData.data);
        setMilestones(milestonesData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Stats Cards Data
  const statsCards = [
    {
      title: "Current Streak",
      value: userData?.currentStreak || 0,
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      description: "consecutive days"
    },
    {
      title: "Longest Streak",
      value: userData?.longestStreak || 0,
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      description: "personal best"
    },
    {
      title: "Total Clean Days",
      value: userData?.totalCleanDays || 0,
      icon: <Star className="w-5 h-5 text-blue-500" />,
      description: "lifetime achievement"
    },
    {
      title: "Milestones Reached",
      value: milestones.length,
      icon: <Award className="w-5 h-5 text-purple-500" />,
      description: "achievements unlocked"
    }
  ];

  // Progress towards goal (assuming 90 days is the goal)
  const progressData = {
    labels: ["Progress", "Remaining"],
    datasets: [{
      data: [userData?.currentStreak || 0, 90 - (userData?.currentStreak || 0)],
      backgroundColor: ["#3B82F6", "#1F2937"],
      borderWidth: 0,
    }]
  };

  // Streak history line chart data
  const streakHistoryData = {
    labels: streakLogs.slice(-30).map(log => new Date(log.date).toLocaleDateString()),
    datasets: [{
      label: "Streak Count",
      data: streakLogs.slice(-30).map(log => log.streak_count),
      fill: true,
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
    }]
  };

  // Success rate calculation
  const totalDays = streakLogs.length;
  const cleanDays = streakLogs.filter(log => log.status === 'clean').length;
  const successRate = totalDays > 0 ? (cleanDays / totalDays) * 100 : 0;

  const successRateData = {
    labels: ["Success", "Relapse"],
    datasets: [{
      data: [successRate, 100 - successRate],
      backgroundColor: ["#10B981", "#EF4444"],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className="text-3xl font-bold text-white">{stat.value}</span>
            </div>
            <h3 className="text-gray-400 font-medium">{stat.title}</h3>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Goal Progress ({userData?.goal_days || 90} Days)
            </h3>
            <span className="text-2xl font-bold text-blue-500">
              {Math.round((userData?.currentStreak / (userData?.goal_days || 90)) * 100)}%
            </span>
          </div>
          <div className="h-64 relative">
            <Doughnut
              data={{
                labels: ["Progress", "Remaining"],
                datasets: [{
                  data: [
                    userData?.currentStreak || 0, 
                    (userData?.goal_days || 90) - (userData?.currentStreak || 0)
                  ],
                  backgroundColor: ["#3B82F6", "#1F2937"],
                  borderWidth: 0,
                }]
              }}
              options={{
                cutout: "75%",
                plugins: {
                  legend: { display: false },
                }
              }}
            />
            
          </div>
        </motion.div>

        {/* Milestones Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-800"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Flag className="w-5 h-5 text-purple-500" />
            Recent Milestones
          </h3>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {milestones.slice(0, 5).map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
              >
                {milestone.milestone_type === 'personal_best' && <Trophy className="w-4 h-4 text-yellow-500" />}
                {milestone.milestone_type === 'goal_reached' && <Target className="w-4 h-4 text-green-500" />}
                {milestone.milestone_type === 'weekly' && <Zap className="w-4 h-4 text-blue-500" />}
                {milestone.milestone_type === 'monthly' && <Award className="w-4 h-4 text-purple-500" />}
                <div>
                  <p className="text-white font-medium">
                    {milestone.days_reached} Day(s) {milestone.milestone_type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(milestone.achieved_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Overall Success Rate
            </h3>
            <span className="text-2xl font-bold text-green-500">
              {successRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-32">
            <Bar
              data={successRateData}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: { color: "rgba(255, 255, 255, 0.7)" },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: { color: "rgba(255, 255, 255, 0.7)" },
                  },
                },
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 