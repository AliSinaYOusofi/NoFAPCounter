import React, { useEffect, useState } from "react";
import { CreateGoalsCard } from "./CreateGoalsCard";
import { GoalsCard } from "./GoalsCard";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import RetryButton from "./global/RetryButton";
import Toast from "./global/Toast";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshGoalsList, setRefreshGoalsList] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [refresh, setRefresh] = useState(false)
    
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "info",
        position: "bottom-right",
    });

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await fetch("/api/save_goal", {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch goals");
                }
                const data = await response.json();
                console.log(data)
                setGoals(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [refreshGoalsList, refresh]);

    const handleDelete = async (id) => {
        
        if (!id) return setError("No ID provided");

        try {

            const response = await fetch(`/api/save_goal?id=${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                setNotification({
                    show: true,
                    message: "Failed to delete goal!",
                    type: "error",
                    position: "top-center",
                });
            }
            
            setGoals(goals.filter((goal) => goal.id !== id));
            
            setNotification({
                show: true,
                message: "Goal was deleted",
                type: "success",
                position: "top-center",
            });

        } catch (error) {
            setError(error.message);
            setNotification({
                show: true,
                message: error.message || "Goal was created",
                type: "error",
                position: "top-center",
            });
        }
    };

    useEffect(() => {
        const handleSort = () => {
            setGoals((goals) => [...goals].reverse());
        };
        handleSort();
    }, [sortOrder]);

    return (
        <div className="min-h-screen relative w-full bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center p-6">
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 bg border border-gray-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white text-center mb-4">
                        Create a New Goal
                    </h2>
                    <CreateGoalsCard
                        setRefreshGoalsList={setRefreshGoalsList}
                    />
                </div>

                <div className="w-full md:w-2/3  p-6 rounded-xl shadow-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">
                            Your Goals : {goals.length}
                        </h2>
                        <motion.button
                            className="flex items-center text-white"
                            onClick={() => setSortOrder(prev => prev === "asc" ? "dsc" : "asc")}
                            whileTap={{ scale: 0.9 }}
                        >
                            {sortOrder === "asc" ? (
                                <ArrowUp className="w-5 h-5" />
                            ) : (
                                <ArrowDown className="w-5 h-5" />
                            )}
                            <span className="ml-2">
                                Date &nbsp;
                                {sortOrder === "asc"
                                    ? "Ascending"
                                    : "Descending"}
                                
                            </span>
                        </motion.button>
                    </div>

                    {
                        loading && <div className="h-screen flex items-center justify-center"> <span className="loading loading-spinner"> </span> </div>
                    }

                    <div
                        className="flex-1 overflow-y-scroll"
                        style={{ maxHeight: "75vh" }}
                    >
                        <AnimatePresence>
                            <div className="grid grid-cols-1 gap-4 ">
                                {goals.length > 0 ? (
                                    goals.map((goal, index) => (
                                        <motion.div
                                            layout
                                            key={goal.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.5, delay: index * 0.2 }}
                                        >
                                            <GoalsCard
                                                id={goal.id}
                                                goal={goal.goal}
                                                description={goal.description}
                                                createdAt={goal.created_at}
                                                onDelete={handleDelete}
                                                setRefreshGoalsList={setRefreshGoalsList}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">
                                        No goals yet. Start by adding one!
                                    </p>
                                )}
                            </div>
                            {error && <RetryButton setRefresh={setRefresh} />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
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
