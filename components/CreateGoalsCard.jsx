"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Toast from "./global/Toast";

// TODO: toast messages for every component starting from goals
export function CreateGoalsCard( { setRefreshGoalsList } ) {
    const [goal, setGoal] = useState("");
    const [description, setDescription] = useState("");
    const [pending, setPending] = useState(false);
    
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "info",
        position: "bottom-right",
    });
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setPending(true);

        if ( ! String(goal).length) return setErrors("Goal can't be empty")
        else if (! String(goal).length) return setErrors("Description can't be empty")

        try {
            const response = await fetch("/api/save_goal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ goal, description }),
            });

            if (response.ok) {
                setGoal("");
                setDescription("");

                setNotification({
                    show: true,
                    message: "Goal was created",
                    type: "success",
                    position: "top-center",
                });
            } else {
                const errorData = await response.json();
                setNotification({
                    show: true,
                    message: errorData?.message || "Failed to create goal!",
                    type: "error",
                    position: "top-center",
                });
            }
        } catch (error) {
            
            setNotification({
                show: true,
                message: "Failed to update goal",
                type: "error",
                position: "top-center",
            });
        } finally {
            setPending(false);
            setRefreshGoalsList( prev => ! prev)
        }
    };

    return (
        <motion.div
            className="w-full relative max-w-md  p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            
            <form onSubmit={handleSubmit} className="w-full">
                <div className="form-control mb-4">
                    <label className="label" htmlFor="goal">
                        <span className="label-text text-gray-400">Goal</span>
                    </label>
                    <input
                        type="text"
                        id="goal"
                        name="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/20 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                        required
                        disabled={pending}
                    />
                </div>
                <div className="form-control mb-4">
                    <label className="label" htmlFor="description">
                        <span className="label-text text-gray-400">Description</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded-lg bg-black/20 border border-gray-800 text-gray-200 focus:border-blue-500 transition-colors"
                        required
                        rows={8}
                        disabled={pending}
                    ></textarea>
                </div>
                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors${pending ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={pending}
                    >
                        {pending ? (
                            <motion.span
                                className="loading loading-spinner loading-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                Creating...
                            </motion.span>
                        ) : (
                            "Create Goal"
                        )}
                    </button>
                </div>
            </form>
            <Toast
                show={notification.show}
                message={notification.message}
                type={notification.type}
                position={notification.position}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />
        </motion.div>
    );
}