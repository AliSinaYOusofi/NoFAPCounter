
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function UpdateGoalsCard({ id, goal: initialGoal, description: initialDescription, setRefreshGoalsList, onClose }) {
    const [goal, setGoal] = useState(initialGoal || "");
    const [description, setDescription] = useState(initialDescription || "");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState(null);
    const [pending, setPending] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPending(true);
        setErrors(null);

        if (!String(goal).length) return setErrors("Goal can't be empty");
        else if (!String(description).length) return setErrors("Description can't be empty");

        try {
            const response = await fetch(`/api/update_goal`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, goal, description }),
            });

            const json = await response.json()
            console.log(json, ' eh')
            if (response.ok) {
                setSuccess(true);
                setGoal("");
                setDescription("");
                
                setTimeout(() => {
                    setSuccess(null);
                    onClose();
                }, 3000);

                
            } else {
                const errorData = await response.json();
                setErrors(errorData.message || "Failed to save goal");
            }
        } catch (error) {
            setErrors(error.message || "Failed to save goal");
        } finally {
            setPending(false);
            setRefreshGoalsList( prev => ! prev)
        }
    };

    return (
        <motion.div
            className="w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-start space-y-6 relative border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-white">{id ? "Update Goal" : "Create Goal"}</h2>

            <AnimatePresence>
                {success && (
                    <motion.div
                        className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg w-full flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Goal {id ? "updated" : "created"} successfully!
                        <X
                            className="cursor-pointer hover:text-white transition-colors"
                            onClick={() => setSuccess(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {errors && (
                    <motion.div
                        className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg w-full flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {errors}
                        <X
                            className="cursor-pointer hover:text-white transition-colors"
                            onClick={() => setErrors(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="goal">
                        Goal
                    </label>
                    <input
                        type="text"
                        id="goal"
                        name="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                        required
                        disabled={pending}
                        placeholder="Enter your goal"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/60 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                        required
                        rows={6}
                        disabled={pending}
                        placeholder="Describe your goal"
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={pending}
                >
                    {pending ? (
                        <>
                            <motion.span
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                            <span>{id ? "Updating..." : "Creating..."}</span>
                        </>
                    ) : (
                        id ? "Update Goal" : "Create Goal"
                    )}
                </button>
            </form>
        </motion.div>
    );
}
