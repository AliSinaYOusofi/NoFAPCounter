"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X as CircleX } from "lucide-react";

export default function Toast({
    show,
    message,
    onClose,
    type = "success",
    duration = 3000,
}) {
    React.useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    // Define styles for each type
    const typeClasses = {
        success: "bg-green-500/50 border border-green-500/50 text-white",
        error: "bg-red-500/50 border border-red-500/50 text-white",
        info: "bg-blue-500/50 border border-blue-500/50 text-white",
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-4 left-1/2 -translate-x-1/2 ${typeClasses[type]} p-4 rounded-lg flex items-center justify-between z-50`}
                >
                    <div className="flex items-center gap-2">
                        {type === "success" && <Check className="w-5 h-5" />}
                        {type === "error" && (
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                        {type === "info" && (
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        )}
                        <span>{message}</span>
                    </div>
                    <CircleX
                        onClick={onClose}
                        className="w-5 h-5 ml-10 cursor-pointer hover:text-green-300 transition-colors"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
