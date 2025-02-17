"use client"

import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";

export default function RetryButton({ setRefresh }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mt-8"
        >
            <button
                onClick={() => setRefresh(prev => !prev)}
                className="flex items-center justify-center px-8 py-2 bg-gray-900/50 p-6  border border-gray-800 text-white rounded-md transition-all duration-200 hover:bg-gray-900/25 group"
            >
                <RotateCw size={20} className="mr-3 group-hover:animate-spin " />
                <p className="text-lg">Retry</p>
            </button>
        </motion.div>
    );
}
