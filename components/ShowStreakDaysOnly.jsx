"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToken } from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import Toast from "./global/Toast";

// TODO: how to update the streak and track the date
export default function ShowStreakDaysOnly({ streakDays }) {
    const [isVisible, setIsVisible] = useState(false);
    const [dayProgress, setDayProgress] = useState(0);
    const [streak, setStreak] = useState(0)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)
    
    const [notification, setNotification] = useState(
        {
            show: false, 
            message: '', 
            type: 'info', 
            position: 'top-center'
        }
    );
    const token = useToken()
    const router = useRouter()
    const [remainingTime, setRemainingTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        setIsVisible(true);
        updateDayProgress();
        const interval = setInterval(updateDayProgress, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCurrentStreakDays = async () => {
            try {
                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await fetch("/api/user_data", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setStreak(data.data?.currentStreak || 0);
            } catch (error) {
                setError("error fetching resourse");
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentStreakDays()
    }, []);
    const updateDayProgress = () => {
        const now = new Date();
        const totalSeconds =
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const progress = totalSeconds / 864;
        setDayProgress(progress);

        // Calculate remaining time
        const remainingSeconds = 86400 - totalSeconds;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        setRemainingTime({ hours, minutes, seconds });
    };

    const digits = String(streakDays).padStart(3, "0").split("");

    const handleUpdateStreak = async () => {

        setNotification({ show: false, message: '' });
        try {
            const response = await fetch("/api/update_streak", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            
            setNotification({ show: true, message: data.message });
            
            setTimeout( () => {
                setNotification({ show: false, message: '' });
            }, 3000)
            setStreak(data.currentStreak);
        } catch (error) {
            setError("Failed to update streak");
        } 
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center card_bg text-white relative overflow-hidden px-4">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="font-bold text-blue-400 flex items-center justify-center relative z-10"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {digits.map((digit, index) => (
                            <motion.span
                                key={index}
                                className="inline-block mx-[0.5vmin] sm:mx-1 text-[20vmin] sm:text-[25vmin] md:text-[30vmin]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    delay: index * 0.15,
                                }}
                            >
                                {streak}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="mt-4 text-lg sm:text-2xl md:text-4xl text-blue-200 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                Days Strong
            </motion.div>

            <motion.div
                className="mt-2 text-md sm:text-lg md:text-2xl text-blue-300 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                {remainingTime.hours}h : {remainingTime.minutes}m :{" "}
                {remainingTime.seconds}s remaining
            </motion.div>

            <motion.button
                onClick={handleUpdateStreak}
                className="mt-8 px-4 sm:px-6 py-2 sm:py-3 bg-transparent border-2 border-blue-400 text-blue-400 rounded-full text-md sm:text-lg font-semibold shadow-lg hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Update Streak
            </motion.button>

            <Toast 
                show={notification.show}
                message={notification.message}
                type={notification.type}
                position={notification.position}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
}
