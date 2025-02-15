"use client";

import { useState } from "react";
import { Maximize, X, Clipboard, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TipsCard({ title, description, number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    return (
        <>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black bg-opacity-50 z-50 flex justify-center items-center"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={cardVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className=" border border-gray-600 text-white p-8 rounded-2xl shadow-2xl flex flex-col items-start space-y-6 max-w-full h-full overflow-auto"
                            style={{ maxWidth: "60%", maxHeight: "70%" }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <p className="w-10 h-10 flex items-center justify-center bg-white text-gray-900 rounded-full text-xl font-bold">
                                        {number}
                                    </p>
                                    <h3 className="text-2xl font-bold">
                                        {title}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <ClipboardCheck className="w-5 h-5 mr-2" />
                                        ) : (
                                            <Clipboard className="w-5 h-5 mr-2" />
                                        )}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                    <X
                                        className="w-8 h-8 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
                                        onClick={toggleExpand}
                                    />
                                </div>
                            </div>
                            <div className="text-lg text-gray-300 leading-relaxed">
                                <p className="mt-10">{description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && (
                <motion.div
                    className="w-full  max-w-md border border-gray-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4 hover:shadow-2xl transition-shadow duration-300"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cardVariants}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <p className="w-8 h-8 flex items-center justify-center bg-white text-gray-900 rounded-full font-bold">
                                {number}
                            </p>
                            <h3 className="text-lg font-bold">{title}</h3>
                        </div>
                        <Maximize
                            className="w-6 h-6 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200"
                            onClick={toggleExpand}
                        />
                    </div>
                    <div className="text-sm text-gray-300">
                        <p className="mb-2 line-clamp-2">{description}</p>
                    </div>
                </motion.div>
            )}
        </>
    );
}
