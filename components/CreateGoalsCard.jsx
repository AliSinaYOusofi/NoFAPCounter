"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// TODO: toast messages for every component starting from goals
export function CreateGoalsCard( { setRefreshGoalsList } ) {
    const [goal, setGoal] = useState("");
    const [description, setDescription] = useState("");
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState(null);
    const [pending, setPending] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPending(true);
        setErrors(null);

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
                setSuccess(true);
                setGoal("");
                setDescription("");

                setTimeout ( () => {
                    setSuccess(null)
                }, 2000)
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
            className="w-full max-w-md  p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence>
                {success && (
                    <motion.div
                        className="bg-green-400 text-white p-4 rounded-lg w-full flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Goal created successfully!
                        <X
                            className="cursor-pointer"
                            onClick={() => setSuccess(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {errors && (
                    <motion.div
                        className="bg-red-400 text-white p-4 rounded-lg w-full flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {errors}
                        <X
                            className="cursor-pointer"
                            onClick={() => setErrors(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="form-control mb-4">
                    <label className="label" htmlFor="goal">
                        <span className="label-text text-gray-300">Goal</span>
                    </label>
                    <input
                        type="text"
                        id="goal"
                        name="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="input input-bordered bg-gray-300 text-white w-full"
                        required
                        disabled={pending}
                    />
                </div>
                <div className="form-control mb-4">
                    <label className="label" htmlFor="description">
                        <span className="label-text text-gray-300">Description</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered bg-gray-300 text-white w-full"
                        required
                        rows={8}
                        disabled={pending}
                    ></textarea>
                </div>
                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className={`bg-white text-black p-3 rounded-md flex items-center justify-center font-normal w-full ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
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
        </motion.div>
    );
}