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
                className="flex items-center justify-center px-8 py-2 bg-white text-black rounded-md"
            >
                <RotateCw size={20} className="mr-3" />
                <p className="text-lg">Retry</p>
            </button>
        </motion.div>
    );
}
