import React, { useState } from "react";
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
                        className="fixed inset-0 card_bg bg-opacity-50 z-50 flex justify-center items-center"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={cardVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className=" border card_bg_bottom text-white p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4 max-w-full h-full overflow-auto"
                            style={{ maxWidth: "50%", maxHeight: "50%" }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full flex justify-between items-center mb-4">
                                <div className="flex gap-4">
                                    <p className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full">{number}</p>
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="flex items-center px-4 py-2 text-white rounded-full text-lg font-semibold"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <ClipboardCheck className="w-5 h-5 mr-2" /> : <Clipboard className="w-5 h-5 mr-2" />}
                                       
                                    </button>
                                    <X
                                        className="cursor-pointer transition-all duration-200 hover:-translate-y-1"
                                        onClick={toggleExpand}
                                    />
                                </div>
                            </div>
                            <div className="text-xl text-gray-300 ">
                                <p className="mt-10">{description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && (
                <motion.div
                    className="w-full card_bg_right max-w-md border border-gray-700 text-white p-6 rounded-xl shadow-lg flex flex-col items-start space-y-4"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cardVariants}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full  flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <p className="px-2 bg-white text-black rounded-full">{number}</p>
                            <h3 className="text-lg font-semibold">{title}</h3>
                        </div>
                        <Maximize
                            className="cursor-pointer transition-all duration-200 hover:-translate-y-1"
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