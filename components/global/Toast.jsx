import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const positions = {
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
};

const types = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
};

export default function Toast({
    show,
    message,
    onClose,
    position = "top-center",
    type = "info",
    duration = 3000,
}) {
    React.useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{
                        opacity: 0,
                        y: position.includes("top") ? -50 : 50,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                        opacity: 0,
                        y: position.includes("top") ? -50 : 50,
                    }}
                    className={`fixed ${positions[position]} ${types[type]} text-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-50`}
                >
                    {type === "success" && (
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
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
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
                    <button
                        onClick={onClose}
                        className="ml-2 hover:text-gray-200 focus:outline-none"
                    >
                        ✕
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
