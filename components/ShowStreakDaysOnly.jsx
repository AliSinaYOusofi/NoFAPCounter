"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./global/Toast";
import RetryButton from "./global/RetryButton";
import { Trophy, Award } from "lucide-react";
import { LightningEffect } from "./LightningEffect";
import { AchievementAndStreakUpdate } from "./streak completed anims/WeeklayCompletedAnime";

// TODO: add a dulingo animation like when updating the streak
export default function ShowStreakDaysOnly() {
    const [isVisible, setIsVisible] = useState(false);
    const [dayProgress, setDayProgress] = useState(0);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [totalCleanDays, setTotalCleanDays] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [userRelapsed, setUserRelapsed] = useState(false);
    const [updating, setUpdating] = useState(false)
    const [showLightning, setShowLightning] = useState(false)
    const [showGoalAcheivedCard, setShowGoalAcheivedCard] = useState(false)

    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "info",
        position: "bottom-right",
    });

    const [relapseNotification, setRelapseNotification] = useState({
        show: false,
        message: "Your streak was reset due to inactivity. Starting from day one again!",
        type: "info",
        position: "bottom-right",
    });

    const [remainingTime, setRemainingTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        updateDayProgress();
        const interval = setInterval(updateDayProgress, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCurrentStreakDays = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/user_data", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setStreak(data?.currentStreak || 0);
                setLongestStreak(data?.longestStreak || 0);
                setTotalCleanDays(data?.totalCleanDays || 0);
            } catch (error) {
                setError("Error fetching resource");
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentStreakDays();
    }, [refresh]);

    useEffect(() => {
        setIsVisible(false);
        setTimeout(() => {
            setIsVisible(true);
            setAnimationKey((prevKey) => prevKey + 1);
        }, 100);
    }, [streak]);

    const updateDayProgress = () => {
        const now = new Date();
        const totalSeconds =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const progress = totalSeconds / 864;
        setDayProgress(progress);

        const remainingSeconds = 86400 - totalSeconds;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        setRemainingTime({ hours, minutes, seconds });
    };

    const digits = String(streak).padStart(4, "0").split("");

    const handleUpdateStreak = async () => {
        
        setUpdating(true)
        
        setNotification({
            show: false,
            message: "",
            type: "info",
            position: "top-center",
        });
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        try {
            const response = await fetch("/api/update_streak", {
                method: "POST",
            });

            const data = await response.json();

            if (response.ok) {
                setLoading(false)
                if (data?.LightningEffect) {
                    setShowLightning(true);
                    
                    setTimeout(() => setShowLightning(false), 1000);
                }

                await sleep(2000)
                
                setNotification({
                    show: true,
                    message: data.message,
                    type: "info",
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
                
                setStreak(data.currentStreak);
                setLongestStreak(data.longestStreak);
                setTotalCleanDays(data.totalCleanDays);
                setUserRelapsed(data?.relapse);
                
                await sleep(1000)
                if (data?.relapse) {
                    setRelapseNotification({
                        show: true,
                        message: "Your streak was reset due to inactivity. Starting from day one again!",
                        type: "info",
                        position: "bottom-right",
                    });
                }

                await sleep(2000)
                if (data?.showCard) setShowGoalAcheivedCard(true)
            }
        } catch (error) {
            setError("Failed to update streak");
        } finally {
            setUpdating(false)
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-black w-full flex items-center justify-center">
                <span className="loading loading-spinner"></span>
            </div>
        );
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
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden px-4">
            
            { showLightning && <LightningEffect /> }

            <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            key={animationKey}
                            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {digits.map((digit, index) => (
                                <motion.span
                                    key={index}
                                    className="inline-block mx-[0.5vmin] sm:mx-1 text-[20vmin] sm:text-[25vmin] md:text-[30vmin] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        delay: index * 0.15,
                                    }}
                                >
                                    {digit}
                                </motion.span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    className="mt-4 text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    Days Strong
                </motion.div>
                
                <motion.div
                    className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-lg sm:text-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 text-blue-300">
                        <Trophy size={24} className="text-blue-400" />
                        <span>Longest: {longestStreak} days</span>
                    </div>
                    <div className="h-4 w-px bg-blue-800 hidden sm:block" />
                    <div className="flex items-center gap-2 text-blue-300">
                        <Award size={24} className="text-blue-400" />
                        <span>Total: {totalCleanDays} days</span>
                    </div>
                </motion.div>
                
                <motion.div
                    className="mt-4 text-xl sm:text-2xl text-blue-300/80 font-mono"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <span className="px-4 py-2 rounded-lg bg-blue-950/30 backdrop-blur-sm">
                        {remainingTime.hours.toString().padStart(2, '0')}:
                        {remainingTime.minutes.toString().padStart(2, '0')}:
                        {remainingTime.seconds.toString().padStart(2, '0')}
                    </span>
                </motion.div>

                <motion.button
                    onClick={handleUpdateStreak}
                    className="mt-12 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold 
                              shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] 
                              transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Update Streak
                    {updating && (
                        <span className="ml-3 loading loading-spinner loading-sm" />
                    )}
                </motion.button>
            </div>

            {/* Toast notifications */}
            <Toast
                show={notification.show}
                message={notification.message}
                type={notification.type}
                position={notification.position}
                onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
            />
            
            <Toast
                show={relapseNotification.show}
                message={relapseNotification.message}
                type={relapseNotification.type}
                position={relapseNotification.position}
                onClose={() => setRelapseNotification((prev) => ({ ...prev, show: false }))}
            />
            
            { showGoalAcheivedCard && <AchievementAndStreakUpdate daysCompleted={streak}/>}
      
        </div>
    );
}
