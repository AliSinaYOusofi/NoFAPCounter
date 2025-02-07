import React, { useEffect, useState } from "react";
import { CreateGoalsCard } from "./CreateGoalsCard";
import { GoalsCard } from "./GoalsCard";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToken } from "@/hooks/useToken";
import { nanoid } from "nanoid";

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [refreshGoalsList, setRefreshGoalsList] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const router = useRouter();
    const token = useToken()

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                console.log(token, ' the token')
                const response = await fetch("/api/save_goal", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch goals");
                }
                const data = await response.json();
                setGoals(data.data);
                console.log(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [refreshGoalsList]);

    const handleDelete = async (id) => {
        
        if (!id) return setError("No ID provided");

        try {
            
            if (! token) return router.push("/login");

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
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        setGoals(
            [...goals].sort((a, b) => {
                if (newSortOrder === "asc") {
                    return new Date(a.created_at) - new Date(b.created_at);
                } else {
                    return new Date(b.created_at) - new Date(a.created_at);
                }
            })
        );
    };

    useEffect(() => {
        const handleSort = () => {
            setGoals((goals) => [...goals].reverse());
        };
        handleSort();
    }, [sortOrder]);

    return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center p-6">
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
                {/* Create Goal Section */}
                <div className="w-full md:w-1/3 bg border border-gray-800 card_bg_bottom p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white text-center mb-4">
                        Create a New Goal
                    </h2>
                    <CreateGoalsCard
                        setRefreshGoalsList={setRefreshGoalsList}
                    />
                </div>

                {/* Goals List Section */}
                <div className="w-full md:w-2/3 bg-black p-6 rounded-xl shadow-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">
                            Your Goals
                        </h2>
                        <motion.button
                            className="flex items-center text-white"
                            onClick={handleSort}
                            whileTap={{ scale: 0.9 }}
                        >
                            {sortOrder === "asc" ? (
                                <ArrowUp className="w-5 h-5" />
                            ) : (
                                <ArrowDown className="w-5 h-5" />
                            )}
                            <span className="ml-2">
                                {sortOrder === "asc"
                                    ? "Ascending"
                                    : "Descending"}
                            </span>
                        </motion.button>
                    </div>

                    {loading && <p className="text-gray-400">Loading...</p>}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="bg-red-300 text-white p-4 rounded-lg w-full flex justify-between items-center mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {error}
                                <X
                                    className="cursor-pointer"
                                    onClick={() => setError(null)}
                                />
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                className="bg-green-300 text-white p-4 rounded-lg w-full flex justify-between items-center mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {success}
                                <X
                                    className="cursor-pointer"
                                    onClick={() => setSuccess(null)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Goals List */}
                    <div
                        className="flex-1 overflow-y-auto"
                        style={{ maxHeight: "75vh" }}
                    >
                        <AnimatePresence>
                            <div className="grid grid-cols-1 gap-4">
                                {goals.length > 0 ? (
                                    goals.map((goal) => (
                                        <motion.div
                                            key={nanoid(4)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <GoalsCard
                                                id={goal.id}
                                                goal={goal.goal}
                                                description={goal.description}
                                                createdAt={goal.created_at}
                                                onDelete={handleDelete}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">
                                        No goals yet. Start by adding one!
                                    </p>
                                )}
                            </div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
