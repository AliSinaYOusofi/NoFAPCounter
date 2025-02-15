import React, { useState } from "react";
import { Clipboard, ClipboardCheck, Edit, Trash2, Maximize, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { UpdateGoalsCard } from "./UpdateGoalsCard";

export function GoalsCard({ id, goal, description, createdAt, onDelete, setRefreshGoalsList }) {
    
    const [copied, setCopied] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showUpdateCard, setShowUpdateCard] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

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
                        className="fixed  inset-0 bg-opacity-50 z-50 flex justify-center md:justify-end items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-gray-950 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4"
                            style={{ width: "80%", height: "80%" }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-full flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{goal}</h3>
                                <X
                                    className="cursor-pointer transition-all duration-200 hover:text-red-500"
                                    onClick={toggleExpand}
                                />
                            </div>
                            <div className="flex-1 flex items-center justify-center text-xl text-gray-300 mb-4">
                                <p className="mb-2 text-center line-clamp-4  overflow-ellipsis">{description}</p>
                            </div>
                            <div className="w-full flex justify-start space-x-2 mt-4">
                                <button
                                    className="flex items-center transition duration-150 hover:bg-white/20 backdrop-blur-sm px-2 py-1 text-white rounded-full text-sm"
                                    onClick={handleCopy}
                                >
                                    {copied ? <ClipboardCheck className="w-4 h-4 mr-1 text-green-500" /> : <Clipboard className="w-4 h-4 mr-1 text-yellow-500" />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                                <button
                                    onClick={() => setShowUpdateCard(true)}
                                    className="flex transition duration-150 hover:bg-white/20 backdrop-blur-sm items-center px-2 py-1 rounded-full text-sm"
                                >
                                    <Edit className="w-4 h-4 mr-1 text-blue-500" />
                                    Edit
                                </button>
                                <button
                                    className="flex transition duration-150 hover:bg-white/20 backdrop-blur-sm items-center px-2 py-1  text-white rounded-full text-sm "
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div
                className=" border border-gray-800 text-white p-4 rounded-lg shadow-md mb-4 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute top-2 right-2">
                    <Maximize
                        className="cursor-pointer transition-all duration-200 hover:text-blue-500"
                        onClick={toggleExpand}
                    />
                </div>

                <h3 className="text-lg font-semibold text-white">{goal}</h3>
                
                <p className="text-gray-400">{description}</p>
                
                
                <div className="flex justify-between items-center space-x-2 mt-4">
                    <p className="text-gray-500 justify-start text-sm">
                        {new Date(createdAt).toLocaleDateString()} 
                        <span>
                            &nbsp;({formatDistanceToNow(new Date(createdAt), { addSuffix: true })})
                        </span>
                    </p>
                    
                    <div className="flex">

                        <button
                            className="flex transition duration-150 hover:bg-white/10 backdrop-blur-sm items-center px-2 py-1 text-white rounded-full text-sm"
                            onClick={handleCopy}
                        >
                            {copied ? <ClipboardCheck className="w-4 h-4 mr-1 text-green-500" /> : <Clipboard className="w-4 h-4 mr-1 text-yellow-500" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                        
                        <button
                            onClick={() => setShowUpdateCard(true)}
                            className="flex transition duration-150 hover:bg-white/10 backdrop-blur-sm items-center px-2 py-1 text-white rounded-full text-sm"
                        >
                            <Edit className="w-4 h-4 mr-1 text-blue-500" />
                            Edit
                        </button>

                        <button
                            className="flex transition duration-150 hover:bg-white/20 backdrop-blur-sm items-center px-2 py-1 text-white rounded-full text-sm"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4 mr-1 text-red-500" />
                            Delete
                        </button>
                    </div>
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
                                className="bg-gray-950 text-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm"
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
                <AnimatePresence>
                    {showUpdateCard && (
                        <motion.div
                            className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black  bg-opacity-90 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <UpdateGoalsCard 
                                setRefreshGoalsList={setRefreshGoalsList}
                                onClose={() => setShowUpdateCard(false)}
                                goal={goal}
                                description={description}
                                id={id}
                                
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}