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
import { AnimatePresence, motion } from "framer-motion";
import {
    Calendar,
    Trophy,
    Target,
    Clock,
    Star,
    Award,
    Zap,
    Flag,
    Flame,
    Trash,
} from "lucide-react";
import Toast from "./Toast";

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
    const [confirmDelete, setConfirmDelete] = useState("");
    const [isDeleting, setIsDeleting] = useState(false)
    const [notification, setNotification] = useState({
      show: false,
      message: "",
      type: "info",
      position: "top-center",
    });

    const fetchData = async () => {
        try {
            const [streakResponse, logsResponse, milestonesResponse] =
                await Promise.all([
                    fetch("/api/streak", { method: "POST" }),
                    fetch("/api/streak_logs"),
                    fetch("/api/milestones"),
                ]);

            const [streakData, logsData, milestonesData] = await Promise.all([
                streakResponse.json(),
                logsResponse.json(),
                milestonesResponse.json(),
            ]);

            if (
                streakData.success &&
                logsData.success &&
                milestonesData.success
            ) {
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

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const statsCards = [
        {
            title: "Current Streak",
            value: userData?.currentStreak || 0,
            icon: <Flame className="w-5 h-5 text-orange-500" />,
            description: "consecutive days",
        },
        {
            title: "Longest Streak",
            value: userData?.longestStreak || 0,
            icon: <Trophy className="w-5 h-5 text-yellow-500" />,
            description: "personal best",
        },
        {
            title: "Total Clean Days",
            value: userData?.totalCleanDays || 0,
            icon: <Star className="w-5 h-5 text-blue-500" />,
            description: "lifetime achievement",
        },
        {
            title: "Milestones Reached",
            value: milestones.length,
            icon: <Award className="w-5 h-5 text-purple-500" />,
            description: "achievements unlocked",
        },
    ];

    const totalDays = streakLogs.length;
    const cleanDays = streakLogs.filter((log) => log.status === "clean").length;
    const successRate = totalDays > 0 ? (cleanDays / totalDays) * 100 : 0;

    const successRateData = {
        labels: ["Success", "Relapse"],
        datasets: [
            {
                data: [successRate, 100 - successRate],
                backgroundColor: ["#10B981", "#EF4444"],
                borderWidth: 0,
            },
        ],
    };

    const handleConfirmDelte = (id) => {
      setConfirmDelete(id)
    }

    const handleDeleteMilestone = async () => {
        
        setIsDeleting(true);
        setNotification({
          show: false,
          message: "",
          type: "info",
          position: "top-center",
        });

        try {
            const response = await fetch(
                `/api/milestones?id=${confirmDelete}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
              setNotification({
                show: true,
                message:  "Failed to delte milestone ",
                type: "error",
                position: "top-center",
              });
            }

            const data = await response.json();

            if (data.success) {
              
              setNotification({
                show: true,
                message: data.message || "Milestone was deleted ",
                type: "success",
                position: "top-center",
              });

              setTimeout(() => {
                setNotification({
                    show: false,
                    message: "",
                    type: "info",
                    position: "top-center",
                });
              }, 5000);

              setMilestones(milestones => milestones.filter(mil => mil.id !== confirmDelete))

            } else {
              setNotification({
                show: true,
                message:  "Failed to delte milestone ",
                type: "error",
                position: "top-center",
              });
            }
        } catch (error) {
            console.error("Error deleting milestone:", error);
            setNotification({
              show: true,
              message: error?.message || "Failed to delte milestone ",
              type: "error",
              position: "top-center",
            });
        } finally {
            setIsDeleting(false);
            setConfirmDelete(null);
        }
    };
    return (
        <div className="space-y-6 p-6">
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
                            <span className="text-3xl font-bold text-white">
                                {stat.value}
                            </span>
                        </div>
                        <h3 className="text-gray-400 font-medium">
                            {stat.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {stat.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            {Math.round(
                                (userData?.currentStreak /
                                    (userData?.goal_days || 90)) *
                                    100
                            )}
                            %
                        </span>
                    </div>
                    <div className="h-64 relative">
                        <Doughnut
                            data={{
                                labels: ["Progress", "Remaining"],
                                datasets: [
                                    {
                                        data: [
                                            userData?.currentStreak || 0,
                                            (userData?.goal_days || 90) -
                                                (userData?.currentStreak || 0),
                                        ],
                                        backgroundColor: ["#3B82F6", "#1F2937"],
                                        borderWidth: 0,
                                    },
                                ],
                            }}
                            options={{
                                cutout: "75%",
                                plugins: {
                                    legend: { display: false },
                                },
                            }}
                        />
                    </div>
                </motion.div>

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
                    <div className="space-y-4 max-h-64 h-full overflow-y-scroll">
                        {milestones.slice(0, 5).map((milestone, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                            >
                                {milestone.milestone_type ===
                                    "personal_best" && (
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                )}
                                {milestone.milestone_type ===
                                    "goal_reached" && (
                                    <Target className="w-4 h-4 text-green-500" />
                                )}
                                {milestone.milestone_type === "weekly" && (
                                    <Zap className="w-4 h-4 text-blue-500" />
                                )}
                                {milestone.milestone_type === "monthly" && (
                                    <Award className="w-4 h-4 text-purple-500" />
                                )}
                                <div className="flex items-center  justify-between w-full">
                                    <div className="">
                                        <p className="text-white font-medium">
                                            {milestone.days_reached} Day(s){" "}
                                            {milestone.milestone_type.replace(
                                                "_",
                                                " "
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(
                                                milestone.achieved_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="">
                                        <Trash
                                            onClick={() =>
                                                handleConfirmDelte(milestone.id)
                                            }
                                            className="w-4 h-4 text-red-400 transition-all duration-200 hover:text-red-800 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {confirmDelete && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-gray-950 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>
                                    Are you sure you want to delete this goal?
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-full"
                                        onClick={handleDeleteMilestone}
                                    >
                                        Yes
                                        {isDeleting && (
                                            <span className="ml-3 loading loading-spinner loading-sm" />
                                        )}
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-600 text-white rounded-full"
                                        onClick={() => setConfirmDelete(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                                indexAxis: "y",
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
                                        ticks: {
                                            color: "rgba(255, 255, 255, 0.7)",
                                        },
                                    },
                                    y: {
                                        grid: {
                                            display: false,
                                        },
                                        ticks: {
                                            color: "rgba(255, 255, 255, 0.7)",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </motion.div>
            </div>
            <Toast
                show={notification.show}
                message={notification.message}
                type={notification.type}
                position={notification.position}
                onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
            />
        </div>
    );
}
