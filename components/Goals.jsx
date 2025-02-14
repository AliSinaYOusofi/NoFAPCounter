import React, { useEffect, useState } from "react";
import { CreateGoalsCard } from "./CreateGoalsCard";
import { GoalsCard } from "./GoalsCard";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import RetryButton from "./global/RetryButton";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [refreshGoalsList, setRefreshGoalsList] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [refresh, setRefresh] = useState(false);

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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete goal");
            }
            setGoals(goals.filter((goal) => goal.id !== id));
            setSuccess("Goal deleted successfully.");
            
            setTimeout ( () => {
                setSuccess(null)
            }, 2000)

        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const handleSort = () => {
            setGoals((goals) => [...goals].reverse());
        };
        handleSort();
    }, [sortOrder]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden p-6">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 via-transparent to-purple-500/30 animate-pulse"></div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                {/* Create Goal Section */}
                <div className="w-full md:w-1/3 backdrop-blur-md bg-black/40 border border-gray-800/50 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 text-center mb-4">
                            Create a New Goal
                        </h2>
                        <CreateGoalsCard setRefreshGoalsList={setRefreshGoalsList} />
                    </div>
                </div>

                {/* Goals List Section */}
                <div className="w-full md:w-2/3 backdrop-blur-md bg-black/40 border border-gray-800/50 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                            Your Goals: {goals.length}
                        </h2>
                        <motion.button
                            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                            onClick={() => setSortOrder(prev => !prev)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {sortOrder === "asc" ? (
                                <ArrowUp className="w-5 h-5" />
                            ) : (
                                <ArrowDown className="w-5 h-5" />
                            )}
                            <span className="ml-2">
                                {sortOrder === "asc" ? "Ascending" : "Descending"}
                            </span>
                        </motion.button>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <span className="loading loading-spinner text-blue-400"></span>
                        </div>
                    )}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-200 p-4 rounded-lg w-full flex justify-between items-center mb-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {error}
                                <X
                                    className="cursor-pointer hover:text-red-100 transition-colors"
                                    onClick={() => setError(null)}
                                />
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                className="bg-green-500/20 backdrop-blur-md border border-green-500/50 text-green-200 p-4 rounded-lg w-full flex justify-between items-center mb-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {success}
                                <X
                                    className="cursor-pointer hover:text-green-100 transition-colors"
                                    onClick={() => setSuccess(null)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "75vh" }}>
                        <AnimatePresence>
                            {goals.length > 0 ? (
                                goals.map((goal) => (
                                    <motion.div
                                        key={nanoid(4)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
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
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-blue-400/60 text-center py-8"
                                >
                                    No goals yet. Start by adding one!
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                    {error && <RetryButton setRefresh={setRefresh} />}
                </div>
            </div>
        </div>
    );
}
