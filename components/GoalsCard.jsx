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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative bg-black/60 border border-gray-800/50 text-white p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4 backdrop-blur-md"
                            style={{ width: "90%", maxWidth: "800px", maxHeight: "90vh" }}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={toggleExpand}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                                {goal}
                            </h3>

                            <div className="w-full overflow-y-auto text-gray-300 text-lg text-center">
                                {description}
                            </div>

                            <div className="flex gap-4 mt-6">
                                <ActionButton icon={<ClipboardCheck />} onClick={handleCopy} label={copied ? "Copied!" : "Copy"} />
                                <ActionButton icon={<Edit />} onClick={() => setShowUpdateCard(true)} label="Edit" />
                                <ActionButton icon={<Trash2 />} onClick={handleDelete} label="Delete" variant="danger" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.div
                className="group backdrop-blur-md bg-black/40 border border-gray-800/50 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                        {goal}
                    </h3>
                    <button
                        onClick={toggleExpand}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                        <Maximize size={20} />
                    </button>
                </div>

                <p className="text-gray-400 line-clamp-2 mb-4">{description}</p>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {new Date(createdAt).toLocaleDateString()} 
                        <span className="ml-1 text-gray-600">
                            ({formatDistanceToNow(new Date(createdAt), { addSuffix: true })})
                        </span>
                    </span>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ActionButton icon={<ClipboardCheck />} onClick={handleCopy} label={copied ? "Copied!" : "Copy"} small />
                        <ActionButton icon={<Edit />} onClick={() => setShowUpdateCard(true)} label="Edit" small />
                        <ActionButton icon={<Trash2 />} onClick={handleDelete} label="Delete" variant="danger" small />
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
                <AnimatePresence>
                    {showUpdateCard && (
                        <motion.div
                            className="fixed inset-0 card_bg_top bg-opacity-90 flex items-center justify-center z-50"
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

// Helper component for buttons
const ActionButton = ({ icon, onClick, label, variant = "default", small = false }) => (
    <motion.button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300
            ${small ? 'text-sm' : 'text-base'}
            ${variant === 'danger' 
                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
            }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        {React.cloneElement(icon, { size: small ? 16 : 20 })}
        <span>{label}</span>
    </motion.button>
);