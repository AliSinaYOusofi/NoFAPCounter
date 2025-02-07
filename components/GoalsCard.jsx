import React, { useState } from "react";
import { Clipboard, ClipboardCheck, Edit, Trash2, Maximize, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GoalsCard({ id, goal, description, createdAt, onDelete }) {
    const [copied, setCopied] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

    console.log(id, ' id here')
    const confirmDeleteGoal = async () => {
        await onDelete(id);
        setConfirmDelete(false);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="card_bg_right text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4"
                            style={{ width: "80%", height: "80%" }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{goal}</h3>
                                <X
                                    className="cursor-pointer transition-all duration-200 hover:-translate-y-1"
                                    onClick={toggleExpand}
                                />
                            </div>
                            <div className="flex-1 flex items-center justify-center text-xl text-gray-300 mb-4">
                                <p className="mb-2 text-center">{description}</p>
                            </div>
                            <div className="w-full flex justify-start space-x-2 mt-4">
                                <button
                                    className="flex items-center px-2 py-1 text-white rounded-full text-sm font-semibold"
                                    onClick={handleCopy}
                                >
                                    {copied ? <ClipboardCheck className="w-4 h-4 mr-1" /> : <Clipboard className="w-4 h-4 mr-1" />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                                <button
                                    className="flex items-center px-2 py-1 text-white rounded-full text-sm font-semibold"
                                >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                </button>
                                <button
                                    className="flex items-center px-2 py-1  text-white rounded-full text-sm font-semibold transition-all duration-200"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                className="card_bg border border-gray-800 text-white p-4 rounded-lg shadow-md mb-4 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute top-2 right-2">
                    <Maximize
                        className="cursor-pointer transition-all duration-200 hover:-translate-y-1"
                        onClick={toggleExpand}
                    />
                </div>

                <h3 className="text-lg font-semibold text-white">{goal}</h3>
                
                <p className="text-gray-400">{description}</p>
                
                <p className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</p>
                
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        className="flex items-center px-2 py-1 text-white rounded-full text-sm font-semibold"
                        onClick={handleCopy}
                    >
                        {copied ? <ClipboardCheck className="w-4 h-4 mr-1" /> : <Clipboard className="w-4 h-4 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                    
                    <button
                        className="flex items-center px-2 py-1 text-white rounded-full text-sm font-semibold"
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                    </button>

                    <button
                        className="flex items-center px-2 py-1 text-white rounded-full text-sm font-semibold"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                    </button>
                </div>
                <AnimatePresence>
                    {confirmDelete && (
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="card_bg_top text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>Are you sure you want to delete this goal?</p>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-4 py-2 bg-red-600 text-white rounded-full"
                                        onClick={confirmDeleteGoal}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-600 text-white rounded-full"
                                        onClick={() => setConfirmDelete(false)}
                                    >
                                        No
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}